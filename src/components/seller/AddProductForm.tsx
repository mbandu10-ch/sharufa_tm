'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { 
  Plus, 
  Loader2, 
  ImageIcon,
  CheckCircle2,
  Trash2,
  Trophy,
  Info,
  Truck,
  X
} from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProduct, updateProduct, getCategoryAttributeTemplates } from '@/app/seller/actions'
import { Category, Country, Product, CategoryAttributeTemplate, ShopType } from '@prisma/client'
import { SHOP_DOMAIN_MAPPING } from '@/lib/constants/shop-categories'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { 
  VEHICLE_BRANDS, 
  FUEL_TYPES, 
  TRANSMISSION_TYPES, 
  STEERING_SIDE, 
  VEHICLE_COLORS 
} from '@/lib/constants/vehicles'
import { compressImage } from '@/lib/utils/image'

const productSchema = z.object({
  name: z.string().min(3, 'Le nom doit faire au moins 3 caractères'),
  description: z.string().min(10, 'La description doit faire au moins 10 caractères'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Le prix doit être un nombre positif',
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Le stock ne peut pas être négatif',
  }),
  categoryId: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  originCountryId: z.string().min(1, 'Veuillez sélectionner un pays'),
  minOrderQuantity: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
    message: 'La quantité doit être un nombre positif',
  }),
  weight: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), { message: 'Doit être positif' }),
  length: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), { message: 'Doit être positif' }),
  width: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), { message: 'Doit être positif' }),
  height: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), { message: 'Doit être positif' }),
})

type ProductFormValues = z.infer<typeof productSchema>

interface AddProductFormProps {
  categories: (Category & { parent?: (Category & { parent?: Category | null }) | null })[]
  countries: Country[]
  shopType: ShopType
  allowedCategoryIds?: string[]
  initialData?: Product & { images: string[]; attributes: any; originCountryId: string | null }
}

export default function AddProductForm({ categories, countries, shopType, allowedCategoryIds = [], initialData }: AddProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Images existantes (URLs de Supabase)
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || [])
  // Nouvelles images à uploader (Fichiers)
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([])
  
  // Attributs dynamiques
  const [attributeTemplates, setAttributeTemplates] = useState<CategoryAttributeTemplate[]>([])
  const [dynamicAttributes, setDynamicAttributes] = useState<Record<string, any>>(initialData?.attributes || {})
  const [level1Id, setLevel1Id] = useState<string>("")
  const [level2Id, setLevel2Id] = useState<string>("")
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([])

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

  const [fetchingTemplates, setFetchingTemplates] = useState(false)
  
  // Tailles et Couleurs
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || [])
  const [colors, setColors] = useState<string[]>(initialData?.colors || [])
  const [sizeInput, setSizeInput] = useState("")
  const [colorInput, setColorInput] = useState("")

  const addSize = () => {
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput])
      setSizeInput("")
    }
  }

  const removeSize = (s: string) => setSizes(sizes.filter(x => x !== s))

  const addColor = () => {
    if (colorInput && !colors.includes(colorInput)) {
      setColors([...colors, colorInput])
      setColorInput("")
    }
  }

  const removeColor = (c: string) => setColors(colors.filter(x => x !== c))

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      price: initialData.price.toString(),
      stock: initialData.stock.toString(),
      categoryId: initialData.categoryId,
      originCountryId: initialData.originCountryId || '',
      minOrderQuantity: initialData.minOrderQuantity?.toString() || '1',
      weight: initialData.weight?.toString() || '',
      length: initialData.length?.toString() || '',
      width: initialData.width?.toString() || '',
      height: initialData.height?.toString() || '',
    } : undefined
  })

  const currentCategoryId = watch('categoryId')
  const isVehicle = NAVIGATION_GROUPS.find(g => g.id === level1Id)?.name.includes('Véhicule')

  // Initialisation complète si initialData existe
  useEffect(() => {
    if (initialData?.categoryId && categories.length > 0 && !level1Id) {
      const dbCat = categories.find(c => c.id === initialData.categoryId);
      if (dbCat) {
        // Reconstruire le chemin complet jusqu'à la racine
        const path: string[] = []
        let current: Category & { parent?: Category | null } | undefined = dbCat
        while (current) {
          path.unshift(current.id)
          current = current.parent as (Category & { parent?: Category | null }) | undefined
        }

        // Le premier élément du chemin est la catégorie racine (ex: vetements-femme)
        const rootCat = categories.find(c => c.id === path[0])
        
        if (rootCat) {
          for (const group of NAVIGATION_GROUPS) {
            for (const item of group.items) {
              if (item.categorySlugs.includes(rootCat.slug)) {
                setLevel1Id(group.id);
                setLevel2Id(item.id);
                setSelectedCategoryPath(path);
                setValue('categoryId', initialData.categoryId);
                return;
              }
            }
          }
        }
      }
    }
  }, [initialData, categories, level1Id, setValue]);

  useEffect(() => {
    async function loadTemplates() {
      if (!currentCategoryId) {
        setAttributeTemplates([])
        return
      }
      
      setFetchingTemplates(true)
      try {
        const { templates, error } = await getCategoryAttributeTemplates(currentCategoryId)
        if (error) {
          console.error('Action error:', error);
        } else {
          setAttributeTemplates(templates || [])
        }
      } catch (err) {
        console.error('Exception in templates fetch:', err);
      } finally {
        setFetchingTemplates(false)
      }
    }
    loadTemplates()
  }, [currentCategoryId])
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      
      if (existingImages.length + newImages.length + selectedFiles.length > 5) {
        toast.error('Maximum 5 images autorisées.')
        return
      }

      setLoading(true)
      const compressPromise = selectedFiles.map(async (file) => {
        try {
          // Si le fichier est déjà petit (< 200KB), on ne compresse pas
          if (file.size < 200 * 1024) return { file, preview: URL.createObjectURL(file) }
          
          const compressed = await compressImage(file)
          return {
            file: compressed,
            preview: URL.createObjectURL(compressed),
          }
        } catch (err) {
          console.error('Compression error:', err)
          return { file, preview: URL.createObjectURL(file) }
        }
      })

      Promise.all(compressPromise).then((filesWithPreview) => {
        setNewImages((prev) => [...prev, ...filesWithPreview])
        setLoading(false)
      })
    }
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (values: ProductFormValues) => {
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error('Au moins une image est requise.')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('price', values.price)
    formData.append('stock', values.stock)
    formData.append('categoryId', values.categoryId)
    formData.append('originCountryId', values.originCountryId)

    if (shopType === 'WHOLESALE_STORE') {
      formData.append('minOrderQuantity', values.minOrderQuantity || '6')
    } else {
      formData.append('minOrderQuantity', values.minOrderQuantity || '1')
    }

    if (values.weight) formData.append('weight', values.weight)
    if (values.length) formData.append('length', values.length)
    if (values.width) formData.append('width', values.width)
    if (values.height) formData.append('height', values.height)

    // Gérer les images pour l'update
    if (initialData) {
      formData.append('existingImages', JSON.stringify(existingImages))
    }

    newImages.forEach((img, index) => {
      formData.append(`images[${index}]`, img.file)
    })

    // Ajouter les attributs dynamiques
    formData.append('attributes', JSON.stringify(dynamicAttributes))
    formData.append('sizes', JSON.stringify(sizes))
    formData.append('colors', JSON.stringify(colors))

    try {
      let result;
      if (initialData) {
        result = await updateProduct(initialData.id, formData)
      } else {
        result = await createProduct(formData)
      }

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(initialData ? 'Produit mis à jour avec succès !' : 'Produit publié avec succès !', {
          duration: 5000,
        })
        router.push('/dashboard/products')
        router.refresh()
      }
    } catch (_error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const allImages = [
    ...existingImages.map(url => ({ url, isExisting: true })),
    ...newImages.map(img => ({ url: img.preview, isExisting: false }))
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Colonne de gauche : Images */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-outfit font-bold text-primary">Photos du produit</h3>
            <p className="text-sm text-muted-foreground">Max 5 images. La première sera la principale.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {allImages.map((img, index) => (
              <div 
                key={index} 
                className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all border-border shadow-sm hover:border-muted-foreground`}
              >
                <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => img.isExisting ? removeExistingImage(index) : removeNewImage(index - existingImages.length)}
                    className="p-2 bg-white rounded-full text-destructive hover:bg-destructive hover:text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-secondary text-primary px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Trophy size={10} /> Principal
                  </div>
                )}
              </div>
            ))}

            {allImages.length < 5 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-secondary/20 flex items-center justify-center transition-colors">
                  <Plus className="text-muted-foreground group-hover:text-secondary" />
                </div>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-secondary uppercase">Ajouter</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={onImageChange}
                />
              </label>
            )}
          </div>
          {allImages.length === 0 && (
            <div className="p-10 border-2 border-dashed rounded-3xl bg-muted/20 flex flex-col items-center justify-center text-center space-y-4">
               <ImageIcon size={48} className="text-muted-foreground/30" />
               <p className="text-sm text-muted-foreground font-medium">Ajoutez vos photos</p>
            </div>
          )}
        </div>

        {/* Colonne de droite : Infos */}
        <div className="lg:col-span-2 space-y-8 bg-background p-8 rounded-[40px] border border-border shadow-sm">
          {/* ÉTAPE 1 : CLASSIFICATION (Maintenant en haut) */}
          <div className="p-10 rounded-[40px] bg-secondary/5 border-2 border-secondary/20 space-y-8 shadow-inner">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-black text-lg">1</div>
               <h3 className="text-xl font-black font-outfit uppercase tracking-tighter text-primary">Classification du produit</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      setValue('categoryId', "")
                    }
                  }}
                >
                  <SelectTrigger className="rounded-2xl border-2 h-14 bg-white shadow-sm border-secondary/10">
                    <SelectValue placeholder="Choisir un univers...">
                      {NAVIGATION_GROUPS.find(g => g.id === level1Id)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {allowedGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id} className="rounded-xl">
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
                      setValue('categoryId', "")
                    }
                  }}
                >
                  <SelectTrigger className="rounded-2xl border-2 h-14 bg-white shadow-sm disabled:opacity-50">
                    <SelectValue placeholder="Choisir un rayon...">
                      {NAVIGATION_GROUPS.find(g => g.id === level1Id)?.items.find(i => i.id === level2Id)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {allowedItems.map((item) => (
                        <SelectItem key={item.id} value={item.id} className="rounded-xl italic font-bold">
                          {item.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* NIVEAUX DYNAMIQUES */}
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
                          setValue('categoryId', val);
                        }
                      }}
                    >
                      <SelectTrigger className={`rounded-2xl border-2 h-14 bg-white shadow-sm ${isLastLevel && !selectedValue ? 'border-secondary/30' : ''}`}>
                        <SelectValue placeholder="Préciser..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {options.map((cat: Category) => (
                            <SelectItem key={cat.id} value={cat.id} className="rounded-xl font-black">
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
            {errors.categoryId && <p className="text-xs text-destructive font-bold ml-1">{errors.categoryId.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3">
              <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Nom du produit</Label>
              <Input 
                {...register('name')} 
                placeholder={isVehicle ? "Ex: Toyota Land Cruiser 2024..." : "Ex: Abaya de Gala..."} 
                className="rounded-2xl border-2 h-14 focus-visible:ring-secondary focus-visible:border-secondary font-bold"
              />
              {errors.name && <p className="text-xs text-destructive font-bold">{errors.name.message}</p>}
            </div>
          </div>

          {/* SECTION DYNAMIQUE : Attributs Spécifiques (Seulement si la classification est complète) */}
          {selectedCategoryPath.length > 0 && attributeTemplates.length > 0 && (
            <div className="p-8 rounded-[32px] bg-secondary/5 border-2 border-secondary/20 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} className="text-secondary" />
                <h4 className="text-sm font-black uppercase tracking-widest text-primary">Caractéristiques spécifiques</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attributeTemplates.map((template) => {
                  const options = (template.options as string[]) || []
                  const value = dynamicAttributes[template.fieldKey] || ''
                  const isVehicle = NAVIGATION_GROUPS.find(g => g.id === level1Id)?.name.includes('Véhicule')

                  // RENDU SPÉCIFIQUE POUR LES VÉHICULES
                  if (isVehicle) {
                    // Marque
                    if (template.fieldKey === 'marque') {
                      return (
                        <div key={template.id} className="space-y-3">
                          <Label className="text-xs font-bold text-muted-foreground">{template.label}*</Label>
                          <Select 
                            value={value}
                            onValueChange={(val: string | null) => {
                              if (val) {
                                setDynamicAttributes(prev => ({ 
                                  ...prev, 
                                  marque: val,
                                  modele: '' // Reset modèle quand la marque change
                                }))
                              }
                            }}
                          >
                            <SelectTrigger className="rounded-xl border-2 h-12 bg-white">
                              <SelectValue placeholder="Choisir une marque..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl max-h-80">
                              {VEHICLE_BRANDS.map(brand => (
                                <SelectItem key={brand.name} value={brand.name} className="font-bold">{brand.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    // Modèle
                    if (template.fieldKey === 'modele') {
                      const selectedBrand = VEHICLE_BRANDS.find(b => b.name === dynamicAttributes['marque'])
                      return (
                        <div key={template.id} className="space-y-3">
                          <Label className="text-xs font-bold text-muted-foreground">{template.label}*</Label>
                          <Select 
                            disabled={!dynamicAttributes['marque']}
                            value={value}
                            onValueChange={(val: string | null) => {
                              if (val) setDynamicAttributes(prev => ({ ...prev, modele: val }))
                            }}
                          >
                            <SelectTrigger className="rounded-xl border-2 h-12 bg-white">
                              <SelectValue placeholder={dynamicAttributes['marque'] ? "Choisir un modèle..." : "Sélectionnez d'abord une marque"} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl max-h-80">
                              {selectedBrand?.models.map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                              ))}
                              <SelectItem value="Autre" className="italic opacity-70">Autre modèle...</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    // Carburant
                    if (template.fieldKey === 'carburant' || template.fieldKey === 'fuel') {
                      return (
                        <div key={template.id} className="space-y-3">
                          <Label className="text-xs font-bold text-muted-foreground">{template.label}*</Label>
                          <Select value={value} onValueChange={(val) => setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: val }))}>
                            <SelectTrigger className="rounded-xl border-2 h-12 bg-white">
                              <SelectValue placeholder="Type de carburant" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {FUEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    // Transmission / Boîte
                    if (template.fieldKey === 'transmission' || template.fieldKey === 'boite') {
                      return (
                        <div key={template.id} className="space-y-3">
                          <Label className="text-xs font-bold text-muted-foreground">{template.label}*</Label>
                          <Select value={value} onValueChange={(val) => setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: val }))}>
                            <SelectTrigger className="rounded-xl border-2 h-12 bg-white">
                              <SelectValue placeholder="Transmission" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {TRANSMISSION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    // Couleur
                    if (template.fieldKey === 'couleur' || template.fieldKey === 'color') {
                      return (
                        <div key={template.id} className="space-y-3">
                          <Label className="text-xs font-bold text-muted-foreground">{template.label}*</Label>
                          <Select value={value} onValueChange={(val) => setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: val }))}>
                            <SelectTrigger className="rounded-xl border-2 h-12 bg-white">
                              <SelectValue placeholder="Couleur" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {VEHICLE_COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    // Volant
                    if (template.fieldKey.includes('volant')) {
                      return (
                        <div key={template.id} className="space-y-3">
                          <Label className="text-xs font-bold text-muted-foreground">{template.label}*</Label>
                          <div className="flex gap-2">
                             {STEERING_SIDE.map(side => (
                               <button
                                 key={side}
                                 type="button"
                                 onClick={() => setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: side }))}
                                 className={`flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                                   value === side ? "bg-secondary border-secondary text-primary shadow-lg" : "bg-white border-slate-100 text-muted-foreground hover:border-slate-300"
                                 }`}
                               >
                                 {side}
                               </button>
                             ))}
                          </div>
                        </div>
                      )
                    }
                  }

                  // RENDU PAR DÉFAUT (Pour les autres catégories ou champs numériques/textes restants)
                  return (
                    <div key={template.id} className="space-y-3">
                      <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        {template.label}
                        {template.required && <span className="text-destructive">*</span>}
                      </Label>

                      {template.fieldType === 'TEXT' && (
                        <Input 
                          value={value}
                          onChange={(e) => setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: e.target.value }))}
                          className="rounded-xl border-2 h-12"
                          placeholder={`Entrez ${template.label.toLowerCase()}...`}
                        />
                      )}

                      {template.fieldType === 'NUMBER' && (
                        <Input 
                          type="number"
                          value={value}
                          min={template.fieldKey === 'annee' ? 1900 : undefined}
                          onChange={(e) => setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: e.target.value }))}
                          className="rounded-xl border-2 h-12"
                        />
                      )}

                      {template.fieldType === 'DATE' && (
                        <Input 
                          type="date"
                          value={value}
                          onChange={(e) => setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: e.target.value }))}
                          className="rounded-xl border-2 h-12"
                        />
                      )}

                      {template.fieldType === 'SELECT' && (
                        <Select 
                          value={value}
                          onValueChange={(val: string | null) => {
                            if (val) setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: val }))
                          }}
                        >
                          <SelectTrigger className="rounded-xl border-2 h-12">
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {options.map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {template.fieldType === 'MULTI_SELECT' && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {options.map((opt) => {
                            const isSelected = Array.isArray(value) && value.includes(opt)
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  const current = Array.isArray(value) ? value : []
                                  const next = isSelected 
                                    ? current.filter(v => v !== opt)
                                    : [...current, opt]
                                  setDynamicAttributes(prev => ({ ...prev, [template.fieldKey]: next }))
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                                  isSelected 
                                    ? "bg-secondary border-secondary text-primary shadow-md" 
                                    : "bg-white border-border text-muted-foreground hover:border-muted-foreground"
                                }`}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {fetchingTemplates && (
            <div className="flex items-center gap-3 p-6 bg-muted/20 rounded-3xl animate-pulse">
                <Loader2 className="animate-spin text-muted-foreground" size={18} />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Chargement des options spécifiques...</span>
            </div>
          )}

          {/* SECTION TAILLES ET COULEURS (Pour Mode & Accessoires) */}
          {(level1Id === 'mode-accessoires' || level1Id === 'enfants-bebe') && (
            <div className="p-8 rounded-[32px] bg-slate-50 border-2 border-slate-100 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Tailles */}
                <div className="space-y-4">
                  <Label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    Tailles disponibles
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      placeholder="Ex: XL, 42, 7 ans..."
                      className="rounded-xl border-2 h-12 bg-white"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    />
                    <Button type="button" onClick={addSize} className="h-12 w-12 rounded-xl shrink-0">
                      <Plus size={20} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(s => (
                      <span key={s} className="bg-white border-2 border-secondary/20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 group">
                        {s}
                        <button type="button" onClick={() => removeSize(s)} className="text-destructive hover:scale-110 transition-transform">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {sizes.length === 0 && <p className="text-[10px] italic text-muted-foreground">Aucune taille définie</p>}
                  </div>
                </div>

                {/* Couleurs */}
                <div className="space-y-4">
                  <Label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    Couleurs disponibles
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder="Ex: Rouge, Bleu Marine..."
                      className="rounded-xl border-2 h-12 bg-white"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    />
                    <Button type="button" onClick={addColor} className="h-12 w-12 rounded-xl shrink-0">
                      <Plus size={20} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(c => (
                      <span key={c} className="bg-white border-2 border-secondary/20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 group">
                        {c}
                        <button type="button" onClick={() => removeColor(c)} className="text-destructive hover:scale-110 transition-transform">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {colors.length === 0 && <p className="text-[10px] italic text-muted-foreground">Aucune couleur définie</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Description détaillée</Label>
            <Textarea 
              {...register('description')} 
              placeholder="Décrivez les matériaux, la coupe, l'entretien..." 
              className="rounded-2xl border-2 min-h-[150px] focus-visible:ring-secondary focus-visible:border-secondary"
            />
            {errors.description && <p className="text-xs text-destructive font-bold">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Prix ($)</Label>
              <Input 
                {...register('price')} 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                className="rounded-2xl border-2 h-14 font-bold"
              />
              {errors.price && <p className="text-xs text-destructive font-bold">{errors.price.message}</p>}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Stock</Label>
              <Input 
                {...register('stock')} 
                type="number" 
                placeholder="0" 
                className="rounded-2xl border-2 h-14 font-bold"
              />
              {errors.stock && <p className="text-xs text-destructive font-bold">{errors.stock.message}</p>}
            </div>

            {/* ORIGINE / SPÉCIFICATIONS */}
            <div className="space-y-3">
              <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                {isVehicle ? "Spécifications (Origine)" : "Pays de fabrication"}
              </Label>
              
              {isVehicle ? (
                <Select 
                  value={dynamicAttributes['specs'] || ''}
                  onValueChange={(val) => {
                    if (val) setDynamicAttributes(prev => ({ ...prev, specs: val }))
                  }}
                >
                  <SelectTrigger className="rounded-2xl border-2 h-14 bg-white font-bold border-secondary/30 shadow-sm">
                    <SelectValue placeholder="Choisir les specs...">
                       {dynamicAttributes['specs'] || 'Choisir les specs...'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="GCC Specs" className="font-bold">GCC Specs (Golfe)</SelectItem>
                    <SelectItem value="American Specs">American Specs</SelectItem>
                    <SelectItem value="European Specs">European Specs</SelectItem>
                    <SelectItem value="Japanese Specs">Japanese Specs</SelectItem>
                    <SelectItem value="Canadian Specs">Canadian Specs</SelectItem>
                    <SelectItem value="Korean Specs">Korean Specs</SelectItem>
                    <SelectItem value="Other">Autres / Non spécifié</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select 
                  value={watch('originCountryId') || ''}
                  onValueChange={(val: string | null) => {
                    if (val) setValue('originCountryId', val)
                  }}
                >
                  <SelectTrigger className="rounded-2xl border-2 h-14 bg-white shadow-sm">
                    <SelectValue placeholder="Provenance">
                      {countries.find(c => c.id === watch('originCountryId')) ? (
                        <div className="flex items-center gap-2 font-bold">
                          {countries.find(c => c.id === (watch('originCountryId') || ''))?.flag} {countries.find(c => c.id === (watch('originCountryId') || ''))?.name}
                        </div>
                      ) : (
                        "Provenance"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id} className="rounded-xl flex items-center gap-2">
                         {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.originCountryId && !isVehicle && <p className="text-xs text-destructive font-bold">{errors.originCountryId.message}</p>}
            </div>
            
            {shopType === 'WHOLESALE_STORE' && (
              <div className="space-y-3">
                <Label className="text-sm font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                  Min. Commande (MOQ)
                </Label>
                <Input 
                  {...register('minOrderQuantity')} 
                  type="number" 
                  defaultValue={initialData?.minOrderQuantity || "6"}
                  min="6"
                  placeholder="Min. 6" 
                  className="rounded-2xl border-2 border-secondary/30 h-14 focus-visible:ring-secondary"
                />
                {errors.minOrderQuantity && <p className="text-xs text-destructive font-bold">{errors.minOrderQuantity.message}</p>}
              </div>
            )}
            
            {/* Dimensions et Poids */}
            <div className="col-span-full border-t border-border pt-8 mt-4 space-y-6">
               <div className="flex items-center gap-2">
                 <Truck size={18} className="text-secondary" />
                 <h4 className="text-sm font-black uppercase tracking-widest text-primary">Informations Logistiques (Fret)</h4>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div className="space-y-3">
                   <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">Poids (kg)</Label>
                   <Input {...register('weight')} type="number" step="0.01" placeholder="Ex: 1.5" className="rounded-xl border-2 h-12 focus-visible:ring-secondary" />
                 </div>
                 <div className="space-y-3">
                   <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">Longueur (cm)</Label>
                   <Input {...register('length')} type="number" step="0.1" placeholder="Ex: 30" className="rounded-xl border-2 h-12 focus-visible:ring-secondary" />
                 </div>
                 <div className="space-y-3">
                   <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">Largeur (cm)</Label>
                   <Input {...register('width')} type="number" step="0.1" placeholder="Ex: 20" className="rounded-xl border-2 h-12 focus-visible:ring-secondary" />
                 </div>
                 <div className="space-y-3">
                   <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">Hauteur (cm)</Label>
                   <Input {...register('height')} type="number" step="0.1" placeholder="Ex: 10" className="rounded-xl border-2 h-12 focus-visible:ring-secondary" />
                 </div>
               </div>
               <p className="text-xs font-bold text-blue-600/80 bg-blue-50 p-4 rounded-xl italic">
                 Ces dimensions sont cruciales pour calculer dynamiquement les frais d&apos;expédition (Poids réel &amp; Poids volumétrique) pour vos clients internationaux.
               </p>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-secondary text-primary hover:bg-secondary/90 text-lg font-black rounded-[20px] shadow-xl hover:shadow-secondary/20 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {initialData ? 'Mettre à jour' : 'Publier'} <CheckCircle2 />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

