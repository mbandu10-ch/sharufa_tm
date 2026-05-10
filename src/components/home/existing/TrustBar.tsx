'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

export function TrustBar() {
  const t = useTranslations('TrustBar')

  return (
    <section className="py-12 border-y border-border bg-white/50 backdrop-blur-sm relative z-20 -mt-8 mx-auto max-w-6xl rounded-2xl shadow-xl shadow-black/5">
      <div className="container mx-auto px-4">
        <p className="text-center text-[10px] md:text-xs font-black text-secondary uppercase tracking-[0.3em] mb-10">
          {t('badge')}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40">
          <div className="text-xl md:text-2xl font-black text-primary tracking-tighter">{t('dubai')}</div>
          <div className="text-xl md:text-2xl font-black text-primary tracking-tighter">{t('turkey')}</div>
          <div className="text-xl md:text-2xl font-black text-primary tracking-tighter">{t('china')}</div>
          <div className="text-xl md:text-2xl font-black text-primary tracking-tighter">{t('logistics')}</div>
        </div>
      </div>
    </section>
  )
}
