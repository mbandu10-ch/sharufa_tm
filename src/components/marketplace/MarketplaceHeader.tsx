'use client'

import { Search, Zap, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function MarketplaceTicker() {
  return (
    <div className="w-full bg-secondary text-primary overflow-hidden py-2 border-b border-primary/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-6">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-primary fill-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">TOP SATIN CHIC - 5.99€</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-primary fill-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">SAC À MAIN MINI - 8.50€</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-primary fill-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">BOUCLES D'OREILLES - 1.99€</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest italic">OFFRES FLASH - JUSQU'À -70%</span>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

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
                className="block w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border rounded-full text-xs font-medium focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1 bottom-1 bg-secondary text-primary font-black px-4 rounded-full hover:bg-primary hover:text-white transition-all text-[10px] uppercase tracking-widest italic">
                Rechercher
              </Button>
            </form>
          </div>
        </div>

        {/* Level 1: Groups (Main Categories) */}
        <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide border-t border-border/50 pt-3">
          <Link 
            href="/marketplace"
            className={cn(
              "text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all px-4 py-2 rounded-full",
              !currentGroup ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Tout explorer
          </Link>
          {NAVIGATION_GROUPS.map((group) => {
            const isSelected = currentGroup === group.id
            return (
              <Link
                key={group.id}
                href={`/marketplace?group=${group.id}`}
                className={cn(
                  "text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all px-4 py-2 rounded-full flex items-center gap-2",
                  isSelected ? "bg-secondary text-primary shadow-lg shadow-secondary/20 scale-105" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {group.name}
              </Link>
            )
          })}
        </div>

        {/* Level 2: Items (Sub-categories) - SHEIN style horizontal icons/pills */}
        {activeGroupData && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide animate-in slide-in-from-left-2 duration-300">
             {activeGroupData.items.map((item) => {
               const isSelected = currentItem === item.id
               return (
                 <Link
                   key={item.id}
                   href={`/marketplace?group=${currentGroup}&item=${item.id}`}
                   className={cn(
                     "flex flex-col items-center gap-1.5 shrink-0 group transition-all",
                     isSelected ? "scale-110" : "hover:translate-y-[-2px]"
                   )}
                 >
                   <div className={cn(
                     "px-5 py-2 rounded-[14px] text-[10px] font-bold whitespace-nowrap transition-all",
                     isSelected 
                      ? "bg-primary text-white shadow-md" 
                      : "bg-white border border-border text-primary group-hover:border-secondary group-hover:text-secondary"
                   )}>
                     {item.name}
                   </div>
                 </Link>
               )
             })}
          </div>
        )}
      </div>
    </div>
  )
}
