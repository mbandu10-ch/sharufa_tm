'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n-navigation'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function MobileExperienceSection() {
  const t = useTranslations('MobileExperience')

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-6xl font-outfit font-bold text-primary leading-tight">
              {t('title')} <span className="text-secondary italic">{t('title_highlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('description')}
            </p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-black rounded-full text-xl shadow-xl hover:scale-105 transition-transform text-center"
            >
              {t('cta')}
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
          <div className="flex-1 relative w-full max-w-[500px] mx-auto aspect-[4/5] rounded-[60px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)] border-[12px] border-primary/10 bg-slate-100">
            <Image 
              src="/images/marketing/mobile-tracking.jpg" 
              alt={t('title')} 
              fill 
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover object-right-bottom hover:scale-102 transition-transform duration-700"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
