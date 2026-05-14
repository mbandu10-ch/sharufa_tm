'use client'

import { Search, ChevronRight } from 'lucide-react'
import { Link } from '@/lib/i18n-navigation'
import { useRouter, useSearchParams } from 'next/navigation'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@sharufa/ui/components/button'
import { MarketplaceTicker } from './MarketplaceTicker'
import { MarketplaceMegaMenu } from './MarketplaceMegaMenu'

export function MarketplaceHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentGroup = searchParams.get('group')
  const currentItem = searchParams.get('item')
  const query = searchParams.get('q') || ''

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q') as string
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set('q', q)
    else params.delete('q')
    router.push(`/marketplace?${params.toString()}`)
  }

  const activeGroupData = NAVIGATION_GROUPS.find(g => g.id === currentGroup)

  return (
    <div className="w-full bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <MarketplaceTicker />
      
      <div className="container mx-auto px-4 lg:px-8 py-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <Link href="/marketplace" className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-xl md:text-2xl font-black font-outfit text-primary uppercase italic shrink-0">
              Marketplace <span className="text-secondary">Sharufa</span>
            </h1>
          </Link>

          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
              </div>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Que recherchez-vous aujourd'hui ?"
                className="block w-full pl-12 pr-4 py-3.5 bg-muted/40 border-none rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-muted-foreground/60 shadow-inner"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1 bottom-1 bg-secondary text-primary font-black px-4 rounded-full hover:bg-primary hover:text-white transition-all text-[10px] uppercase tracking-widest italic">
                Rechercher
              </Button>
            </form>
          </div>
        </div>

        {/* Navigation Principale (Style SHEIN) */}
        <div className="flex items-center gap-6 pb-2 border-t border-border/50 pt-4 relative z-50">
          
          {/* Menu Dropdown Massif (Catégories) */}
          <div className="shrink-0">
            <MarketplaceMegaMenu />
          </div>

          {/* Liens Rapides (Top Univers ou pages spécifiques) */}
          <div className="flex items-center gap-6 ml-2 border-l border-border/50 pl-6 flex-1 overflow-x-auto scrollbar-hide">
            <Link href="/marketplace" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
              Nouveautés
            </Link>
            <Link href="/marketplace?view=shops" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
              Boutiques Officielles
            </Link>
            {NAVIGATION_GROUPS.slice(0, 5).map(group => (
              <Link 
                key={group.id} 
                href={`/marketplace?group=${group.id}`}
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap",
                  currentGroup === group.id ? "text-secondary" : "text-muted-foreground hover:text-primary"
                )}
              >
                {group.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

