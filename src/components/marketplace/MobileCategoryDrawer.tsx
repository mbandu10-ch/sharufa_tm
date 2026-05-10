'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  X, 
  Search, 
  ChevronRight, 
  LayoutGrid, 
  ChevronLeft,
  Filter
} from 'lucide-react'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileCategoryDrawerProps {
  currentGroupId?: string
  currentItemId?: string
  currentCategorySlug?: string
  categories?: any[]
}

export function MobileCategoryDrawer({
  currentGroupId,
  currentItemId,
  currentCategorySlug,
  categories = []
}: MobileCategoryDrawerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tNav = useTranslations('NavigationGroups')
  const t = useTranslations('Marketplace')
  
  const isOpen = searchParams.get('mobile_filters') === 'open'
  const [searchQuery, setSearchQuery] = useState('')

  const setIsOpen = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (open) {
      params.set('mobile_filters', 'open')
    } else {
      params.delete('mobile_filters')
    }
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  const handleGroupClick = (groupSlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('group', groupSlug)
    params.set('mobile_filters', 'open') // Keep open
    params.delete('item')
    params.delete('category')
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  const handleItemClick = (groupSlug: string, itemSlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('group', groupSlug)
    params.set('item', itemSlug)
    params.delete('category')
    params.delete('mobile_filters') // Close on final selection
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', categorySlug)
    params.delete('mobile_filters') // Close on final selection
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return NAVIGATION_GROUPS

    return NAVIGATION_GROUPS.map(group => ({
      ...group,
      items: group.items.filter(item => 
        tNav(item.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        tNav(group.id).toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => 
      tNav(group.id).toLowerCase().includes(searchQuery.toLowerCase()) || 
      group.items.length > 0
    )
  }, [searchQuery, tNav])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={
        <Button className="bg-primary text-white font-black px-10 py-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex gap-3 scale-110 active:scale-95 transition-all border-2 border-white/20 backdrop-blur-md">
          <Filter size={20} className="text-secondary" /> 
          <span className="uppercase tracking-widest text-[10px]">{t('filter_by_universe')}</span>
        </Button>
      } />
      <SheetContent 
        side="bottom" 
        className="h-[95vh] rounded-t-[40px] p-0 flex flex-col bg-white overflow-hidden border-t-4 border-secondary"
        showCloseButton={false}
      >
        {/* Header with Search */}
        <div className="p-6 space-y-6 border-b border-border/50 shrink-0 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary">
                <LayoutGrid size={20} />
              </div>
              <h2 className="text-xl font-outfit font-black text-primary uppercase tracking-tight">
                {t('all_universes').split(' ')[0]} <span className="text-secondary italic">{t('all_universes').split(' ').slice(1).join(' ')}</span>
              </h2>
            </div>
            <SheetClose render={
              <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-secondary/20 transition-colors">
                <X size={20} className="text-primary" />
              </Button>
            } />
          </div>

          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors" size={20} />
            <input 
              type="text"
              placeholder={t('search_category')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border-2 border-transparent focus:border-secondary/30 focus:bg-white rounded-3xl py-4 pl-14 pr-6 outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-grow overflow-y-auto pb-10">
          <div className="p-4 space-y-4">
            {filteredGroups.map((group) => {
              const Icon = group.icon
              const isSelected = currentGroupId === group.id
              const isExpanded = isSelected || searchQuery.length > 0

              return (
                <div key={group.id} className="space-y-2">
                  <button
                    onClick={() => handleGroupClick(group.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-[28px] transition-all group",
                      isSelected 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "bg-muted/30 text-primary hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isSelected ? "bg-secondary text-primary" : "bg-white text-muted-foreground group-hover:bg-secondary/20 group-hover:text-primary shadow-sm"
                      )}>
                        <Icon size={20} />
                      </div>
                      <span className="font-black uppercase tracking-widest text-[11px]">{tNav(group.id)}</span>
                    </div>
                    {group.items.length > 0 && (
                      <ChevronRight 
                        size={18} 
                        className={cn("transition-transform duration-500", isExpanded && "rotate-90 text-secondary")} 
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && group.items.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-2 pl-4 pr-2"
                      >
                        {group.items.map((item) => {
                          const isSubSelected = currentItemId === item.id
                          return (
                            <div key={item.id} className="space-y-2">
                              <button
                                onClick={() => handleItemClick(group.id, item.id)}
                                className={cn(
                                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all border-l-4",
                                  isSubSelected 
                                    ? "bg-secondary/10 border-secondary text-primary" 
                                    : "bg-muted/10 border-transparent text-muted-foreground/80 hover:border-secondary/30"
                                )}
                              >
                                <span className="text-[10px] font-black uppercase tracking-widest">{tNav(item.id)}</span>
                                {isSubSelected && <div className="w-2 h-2 rounded-full bg-secondary" />}
                              </button>

                              {isSubSelected && categories.length > 0 && (
                                <div className="grid grid-cols-1 gap-2 pl-4 border-l border-muted/50 py-2">
                                  {categories.map((cat) => (
                                    <button
                                      key={cat.id}
                                      onClick={() => handleCategoryClick(cat.slug)}
                                      className={cn(
                                        "w-full text-left p-3 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all",
                                        currentCategorySlug === cat.slug 
                                          ? "bg-primary text-white shadow-lg" 
                                          : "bg-white border border-border/50 text-muted-foreground/60 hover:text-primary"
                                      )}
                                    >
                                      {cat.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {filteredGroups.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                  <Search size={40} />
                </div>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">{t('no_universes')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-muted/30 border-t border-border/50 text-center shrink-0">
           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
             {t('explore_more')}
           </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
