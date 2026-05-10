'use client'

import React from 'react'
import { Link } from '@/lib/i18n-navigation'
import { useTranslations } from 'next-intl'

export function SellerCTASection() {
  const t = useTranslations('SellerCTA')

  return (
    <section className="py-24 bg-primary rounded-[60px] mx-4 md:mx-12 my-12 text-center text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-6xl font-outfit font-bold mb-8">{t('title')}</h2>
        <p className="text-xl text-primary-foreground/70 mb-12 max-w-2xl mx-auto">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/seller/register" 
            className="w-full sm:w-auto px-10 py-5 bg-secondary text-primary font-black rounded-full text-xl shadow-xl hover:scale-105 transition-transform"
          >
            {t('cta_open')}
          </Link>
          <Link 
            href="/seller" 
            className="text-white font-bold underline underline-offset-8 decoration-secondary decoration-2 hover:text-secondary transition-colors"
          >
            {t('cta_learn')}
          </Link>
        </div>
      </div>
    </section>
  )
}
