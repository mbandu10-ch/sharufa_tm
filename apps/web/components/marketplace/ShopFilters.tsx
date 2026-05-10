'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sharufa/ui/components/select'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Store } from 'lucide-react'

interface ShopFiltersProps {
  countries?: { id: string, name: string, code: string, flag: string | null }[]
}

export function ShopFilters({ countries }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentGroup = searchParams.get('group') || ''
  const currentShopType = searchParams.get('shopType') || ''

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[40px] border border-border shadow-sm mb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => handleFilterChange('group', 'all')}
                    className={cn(
                        "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        !currentGroup 
                          ? "bg-primary text-secondary shadow-xl shadow-primary/20 ring-2 ring-primary ring-offset-2 scale-105" 
                          : "bg-muted/50 hover:bg-muted text-muted-foreground border border-transparent"
                    )}
                >
                    Tous les Univers
                </button>
                {NAVIGATION_GROUPS.map((group) => (
                    <button
                        key={group.id}
                        onClick={() => handleFilterChange('group', group.id)}
                        className={cn(
                            "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                            currentGroup === group.id 
                              ? "bg-secondary text-primary shadow-xl shadow-secondary/20 ring-2 ring-secondary ring-offset-2 scale-105" 
                              : "bg-muted/50 hover:bg-muted text-muted-foreground border border-transparent"
                        )}
                    >
                        {group.name}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:border-l lg:pl-8 border-border/50">
                {/* Type de Boutique */}
                <div className={cn(
                  "flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-300",
                  currentShopType && currentShopType !== 'all' 
                    ? "bg-secondary/10 border-secondary ring-1 ring-secondary" 
                    : "bg-muted/40 border-border/50"
                )}>
                    <Store className={cn("w-4 h-4", currentShopType && currentShopType !== 'all' ? "text-primary" : "text-secondary")} />
                    <Select 
                        value={currentShopType || "all"} 
                        onValueChange={(val) => handleFilterChange('shopType', val)}
                    >
                        <SelectTrigger className="w-[150px] border-none bg-transparent font-black uppercase tracking-widest text-[10px] h-8 shadow-none focus:ring-0 p-0">
                            <SelectValue placeholder="Type Vendeur" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border shadow-2xl">
                            <SelectItem value="all" className="font-bold text-xs">Tous types</SelectItem>
                            <SelectItem value="WHOLESALE" className="font-bold text-xs">Grossiste (B2B)</SelectItem>
                            <SelectItem value="RETAIL" className="font-bold text-xs">Détail (B2C)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    </div>
  )
}
