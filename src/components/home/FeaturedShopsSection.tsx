'use client'

import React from 'react'
import { Link } from '@/lib/i18n-navigation'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { ShopCard } from './ShopCard'
import { useTranslations } from 'next-intl'

interface FeaturedShopsSectionProps {
  shops: {
    id: string
    name: string
    slug: string
    logo: string | null
    country: string | null
    _count: { products: number }
  }[]
}

export function FeaturedShopsSection({ shops }: FeaturedShopsSectionProps) {
  const t = useTranslations('FeaturedShops')

  if (!shops || shops.length === 0) {
    return (
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
            <SectionHeader 
                title={t('title')} 
                subtitle={t('subtitle')}
            />
            <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm rounded-[40px] p-12 border border-border">
                <p className="text-muted-foreground italic mb-6">
                    Connect with the best hand-picked international sellers.
                </p>
                <Link 
                    href="/seller/register" 
                    className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
                >
                    Become a seller on Sharufa <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title={t('title')} 
          subtitle={t('subtitle')}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>

        <div className="mt-12 text-center">
            <Link 
                href="/marketplace?view=shops" 
                className="text-primary font-bold hover:text-secondary underline underline-offset-8 decoration-secondary transition-all"
            >
                {t('view_all')}
            </Link>
        </div>
      </div>
    </section>
  )
}
