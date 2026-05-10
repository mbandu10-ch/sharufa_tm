'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, 
  LayoutGrid,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { useTranslations } from 'next-intl'

interface CategorySidebarProps {
  currentGroupId?: string
  currentItemId?: string
  currentCategorySlug?: string
  categories?: any[]
}

export function CategorySidebar({ 
    currentGroupId, 
    currentItemId, 
    currentCategorySlug,
    categories = [] 
}: CategorySidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tNav = useTranslations('NavigationGroups')
  const t = useTranslations('Marketplace')

  const handleGroupClick = (groupSlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('group', groupSlug)
    params.delete('item')
    params.delete('category')
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  const handleItemClick = (groupSlug: string, itemSlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('group', groupSlug)
    params.set('item', itemSlug)
    params.delete('category')
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', categorySlug)
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  return (
    <aside className="w-full lg:w-80 space-y-8">
      <div className="bg-white rounded-[40px] p-8 border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-8">
            <LayoutGrid className="text-secondary w-6 h-6" />
            <h2 className="text-xl font-outfit text-primary tracking-tight">
                <span className="font-normal">{t('our_categories').split(' ')[0]} </span>
                <span className="font-black">{t('our_categories').split(' ').slice(1).join(' ')}</span>
            </h2>
        </div>

        <nav className="space-y-3">
          <button
            onClick={() => {
                const params = new URLSearchParams()
                params.set('view', 'products')
                router.push(`/marketplace?${params.toString()}`)
            }}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all",
              !currentGroupId ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
            )}
          >
            <LayoutGrid size={18} />
            {t('all_categories')}
          </button>

          <div className="h-px bg-border/50 my-6 mx-4" />

          {NAVIGATION_GROUPS.map((group) => {
            const Icon = group.icon
            const isSelected = currentGroupId === group.id
            const isExpanded = isSelected

            return (
              <div key={group.id} className="space-y-2">
                <button
                  onClick={() => handleGroupClick(group.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.15em] transition-all group",
                    isSelected ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isSelected ? "bg-secondary text-primary" : "bg-muted/40 text-muted-foreground group-hover:bg-secondary/20 group-hover:text-primary"
                    )}>
                        <Icon size={18} strokeWidth={isSelected ? 2 : 1.5} />
                    </div>
                    <span className="text-left leading-none ">{tNav(group.id)}</span>
                  </div>
                  {group.items.length > 0 && (
                    <ChevronRight 
                      size={16} 
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
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden pl-12 pr-4 space-y-1"
                    >
                      {group.items.map((item) => {
                        const isSubSelected = currentItemId === item.id
                        return (
                          <div key={item.id} className="space-y-1">
                            <button
                              onClick={() => handleItemClick(group.id, item.id)}
                              className={cn(
                                "w-full text-left px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative border-l-2",
                                isSubSelected 
                                  ? "text-primary border-secondary bg-secondary/5" 
                                  : "text-muted-foreground/60 border-transparent hover:border-secondary/30 hover:text-primary"
                              )}
                            >
                              {tNav(item.id)}
                            </button>

                            {isSubSelected && categories.length > 0 && (
                                <div className="pl-4 border-l border-muted py-2 space-y-1">
                                    {categories.map((cat) => {
                                        const isCatSelected = currentCategorySlug === cat.slug
                                        return (
                                            <div key={cat.id} className="space-y-1">
                                                <button
                                                    onClick={() => handleCategoryClick(cat.slug)}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all",
                                                        isCatSelected ? "text-secondary bg-secondary/5" : "text-muted-foreground/50 hover:text-primary"
                                                    )}
                                                >
                                                    {cat.name}
                                                </button>
                                                
                                                {isCatSelected && cat.subCategories?.length > 0 && (
                                                    <div className="pl-3 border-l border-secondary/20 py-1 space-y-1">
                                                        {cat.subCategories.map((sub: any) => (
                                                            <button
                                                                key={sub.id}
                                                                onClick={() => handleCategoryClick(sub.slug)}
                                                                className={cn(
                                                                    "w-full text-left px-2 py-1.5 rounded-lg text-[8px] font-bold uppercase transition-all",
                                                                    currentCategorySlug === sub.slug ? "text-secondary" : "text-muted-foreground/40 hover:text-primary"
                                                                )}
                                                            >
                                                                {sub.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
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
        </nav>
      </div>

      <div className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary rounded-full blur-[80px] opacity-20 group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                <ShoppingBag size={24} />
            </div>
            <div>
                <h3 className="text-2xl font-outfit mb-3 leading-tight tracking-tight">
                    <span className="font-normal">{t('buy_for_me_title').split(' ')[0]} </span>
                    <span className="text-secondary font-black italic">{t('buy_for_me_title').split(' ').slice(1).join(' ')}</span>
                </h3>
                <p className="text-xs text-primary-foreground/60 font-medium leading-relaxed">{t('buy_for_me_desc')}</p>
            </div>
            <button 
              onClick={() => router.push('/buy-for-me')}
              className="w-full py-4 bg-secondary text-primary font-black rounded-2xl hover:bg-white transition-all uppercase text-[10px] tracking-widest shadow-xl scale-100 hover:scale-105 active:scale-95"
            >
            {t('find_product')}
            </button>
        </div>
      </div>
    </aside>
  )
}
