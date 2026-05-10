'use client'

import React from 'react'
import { Link } from '@/lib/i18n-navigation'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { ProductCard } from './ProductCard'
import { useTranslations } from 'next-intl'

interface FeaturedProductsSectionProps {
  products: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    shop: { name: string; slug: string } | null
    originCountry: { name: string; code: string } | null
    isSharufa?: boolean
  }[]
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const t = useTranslations('FeaturedProducts')

  if (!products || products.length === 0) {
    return (
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title={t('title')} 
            subtitle={t('subtitle')}
          />
          <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-muted-foreground/30 shadow-inner">
             <p className="text-muted-foreground font-medium text-lg">
               Our teams are currently selecting the best products from Dubai, Turkey and China.
             </p>
             <Link 
               href="/marketplace" 
               className="inline-flex items-center gap-2 mt-8 text-secondary font-bold hover:underline"
             >
                {t('view_all')} <ArrowRight className="w-4 h-4" />
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
            <Link 
                href="/marketplace" 
                className="inline-flex items-center gap-2 sm:gap-4 px-6 py-4 sm:px-10 sm:py-5 bg-primary text-white font-black rounded-full text-base sm:text-xl shadow-xl hover:scale-105 transition-transform"
            >
                {t('view_all')}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            </Link>
        </div>
      </div>
    </section>
  )
}
