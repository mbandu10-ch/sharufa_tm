'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n-navigation'
import { ChevronRight, Home } from 'lucide-react'
import { NAVIGATION_GROUPS } from '@/lib/navigation'

interface BreadcrumbsProps {
  groupId?: string
  itemId?: string
}

export function MarketplaceBreadcrumbs({ groupId, itemId }: BreadcrumbsProps) {
  const tNav = useTranslations('NavigationGroups')
  const t = useTranslations('Marketplace')
  
  const group = NAVIGATION_GROUPS.find(g => g.id === groupId)
  const item = group?.items.find(i => i.id === itemId)

  return (
    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-8 overflow-x-auto whitespace-nowrap pb-2">
      <Link href="/marketplace" className="hover:text-primary transition-colors flex items-center gap-1.5">
        <Home size={12} /> {t('marketplace')}
      </Link>
      
      {group && (
        <>
          <ChevronRight size={10} />
          <Link 
            href={`/marketplace?group=${group.id}`} 
            className="hover:text-primary transition-colors text-muted-foreground"
          >
            {tNav(group.id)}
          </Link>
        </>
      )}

      {item && (
        <>
          <ChevronRight size={10} />
          <span className="text-secondary">{tNav(item.id)}</span>
        </>
      )}
    </nav>
  )
}
