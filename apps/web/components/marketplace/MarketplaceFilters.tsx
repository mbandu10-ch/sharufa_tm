'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

interface Country {
  id: string
  name: string
  code: string
  flag: string | null
}

interface MarketplaceFiltersProps {
  countries: Country[]
}

export function MarketplaceFilters({ countries }: MarketplaceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCountry = searchParams.get('country') || 'all'

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full lg:w-auto">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-x-visible lg:pb-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-2 rounded-full bg-muted/50 border border-border">
            <Globe className="w-4 h-4 text-secondary" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFilterChange('country', 'all')}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
              currentCountry === 'all'
                ? "bg-secondary text-primary border-secondary shadow-lg shadow-secondary/20 scale-105"
                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50"
            )}
          >
            Tous les pays
          </button>

          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => handleFilterChange('country', c.code)}
              className={cn(
                "whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-2",
                currentCountry === c.code
                  ? "bg-secondary text-primary border-secondary shadow-lg shadow-secondary/20 scale-105"
                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50"
              )}
            >
              <span className="text-sm leading-none">{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
