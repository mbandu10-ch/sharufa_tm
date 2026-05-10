'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n-navigation'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function SourcingSection() {
  const t = useTranslations('Sourcing')

  return (
    <section className="py-24 relative overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full font-bold text-sm">
               {t('badge')}
            </div>
            <h2 className="text-4xl md:text-6xl font-outfit font-bold text-primary leading-tight">
              {t('title')}
              <span className="text-secondary italic">{t('title_highlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              {t('description')}
            </p>
            
            <ul className="space-y-4">
              {[t('feature1'), t('feature2'), t('feature3'), t('feature4')].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-primary font-medium">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link 
              href="/buy-for-me" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-secondary font-black rounded-full group overflow-hidden relative shadow-lg text-center uppercase tracking-widest text-xs italic"
            >
              {t('cta')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex-1 relative w-full aspect-square md:aspect-video lg:aspect-square bg-muted rounded-[40px] overflow-hidden group shadow-2xl">
             <Image 
               src="/images/marketing/warehouse.jpg" 
               alt="Sourcing Express" 
               fill 
               className="object-cover" 
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
