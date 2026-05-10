'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Category, ShopType } from '@prisma/client'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { SHOP_DOMAIN_MAPPING } from '@/lib/constants/shop-categories'
import { toast } from 'sonner'
import { bulkUpdateProductCategory } from '@/app/seller/actions'
import { Loader2 } from 'lucide-react'

interface BulkCategoryUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProductIds: string[]
  categories: (Category & { parent?: (Category & { parent?: Category | null }) | null })[]
  shopType: ShopType
  allowedCategoryIds?: string[]
  onSuccess: () => void
}

export function BulkCategoryUpdateModal({
  isOpen,
  onClose,
  selectedProductIds,
  categories,
  shopType,
  allowedCategoryIds = [],
  onSuccess
}: BulkCategoryUpdateModalProps) {
  const [level1Id, setLevel1Id] = useState<string>("")
  const [level2Id, setLevel2Id] = useState<string>("")
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const { allowedGroups, allowedItems, dynamicLevelOptions } = useMemo(() => {
    const groups = NAVIGATION_GROUPS.filter(group => {
      const allowedDomains = SHOP_DOMAIN_MAPPING[shopType] || []
      const isDomainAllowed = allowedDomains.some(domain => group.name.includes(domain) || domain.includes(group.name))
      if (allowedCategoryIds.length > 0) {
        const groupTechnicalCats = categories.filter(c => 
          group.items.some(item => item.categorySlugs.includes(c.slug))
        )
        return groupTechnicalCats.some(c => {
           let root = c;
           while(root.parent) { root = root.parent as (Category & { parent?: Category | null }) }
           return allowedCategoryIds.includes(root.id);
        });
      }
      return isDomainAllowed;
    });

    const activeGroup = NAVIGATION_GROUPS.find(g => g.id === level1Id);
    const items = activeGroup?.items || [];

    const activeItem = activeGroup?.items.find(i => i.id === level2Id);
    const slugs = activeItem?.categorySlugs || [];
    const level3Options = categories.filter(c => slugs.includes(c.slug));
    
    const dynamicLevelOptions: Category[][] = [];
    if (level2Id) {
      dynamicLevelOptions.push(level3Options);
      
      let currentParentId = selectedCategoryPath[0];
      let currentIndex = 0;
      
      while (currentParentId) {
        const children = categories.filter(c => c.parentId === currentParentId);
        if (children.length > 0) {
          dynamicLevelOptions.push(children);
          currentParentId = selectedCategoryPath[currentIndex + 1];
          currentIndex++;
        } else {
          break;
        }
      }
    }

    return { allowedGroups: groups, allowedItems: items, dynamicLevelOptions };
  }, [categories, shopType, allowedCategoryIds, level1Id, level2Id, selectedCategoryPath]);

  const handleUpdate = async () => {
    const finalCategoryId = selectedCategoryPath[selectedCategoryPath.length - 1];
    if (!finalCategoryId) {
      toast.error('Veuillez sélectionner une catégorie précise.')
      return
    }

    setLoading(true)
    try {
      const result = await bulkUpdateProductCategory(selectedProductIds, finalCategoryId)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Catégorie mise à jour pour ${selectedProductIds.length} produit(s)`)
        onSuccess()
        onClose()
      }
    } catch (error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black font-outfit">Changer la catégorie</DialogTitle>
          <DialogDescription>
            Vous modifiez la catégorie de {selectedProductIds.length} produit(s).
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* ÉTAPE 1.1 : UNIVERS */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Univers de vente</Label>
            <Select 
              value={level1Id}
              onValueChange={(val: string | null) => {
                if (val) {
                  setLevel1Id(val)
                  setLevel2Id("")
                  setSelectedCategoryPath([])
                }
              }}
            >
              <SelectTrigger className="rounded-xl border-2 h-12">
                <SelectValue placeholder="Choisir un univers..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {allowedGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id} className="rounded-lg">
                      <div className="flex items-center gap-2">
                         <group.icon size={16} className="text-secondary" />
                         {group.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* ÉTAPE 1.2 : RAYON */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Rayon spécifique</Label>
            <Select 
              disabled={!level1Id}
              value={level2Id}
              onValueChange={(val: string | null) => {
                if (val) {
                  setLevel2Id(val)
                  setSelectedCategoryPath([])
                }
              }}
            >
              <SelectTrigger className="rounded-xl border-2 h-12 disabled:opacity-50">
                <SelectValue placeholder="Choisir un rayon..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {allowedItems.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="rounded-lg italic font-bold">
                      {item.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* NIVEAUX DYNAMIQUES (Catégorie, Sous-catégorie, etc.) */}
          {dynamicLevelOptions.map((options, index) => {
            const selectedValue = selectedCategoryPath[index] || "";
            const isLastLevel = index === dynamicLevelOptions.length - 1;
            const label = index === 0 ? "Catégorie principale" : `Sous-catégorie (Niveau ${index + 3})`;
            
            return (
              <div key={index} className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</Label>
                <Select 
                  value={selectedValue}
                  onValueChange={(val: string | null) => {
                    if (val) {
                      const newPath = selectedCategoryPath.slice(0, index);
                      newPath.push(val);
                      setSelectedCategoryPath(newPath);
                    }
                  }}
                >
                  <SelectTrigger className={`rounded-xl border-2 h-12 ${isLastLevel && !selectedValue ? 'border-secondary/30' : ''}`}>
                    <SelectValue placeholder="Préciser..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {options.map((cat: Category) => (
                        <SelectItem key={cat.id} value={cat.id} className="rounded-lg font-black">
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading} className="rounded-xl">
            Annuler
          </Button>
          <Button onClick={handleUpdate} disabled={loading || selectedCategoryPath.length === 0} className="rounded-xl bg-primary text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
