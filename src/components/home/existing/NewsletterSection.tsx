'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function NewsletterSection() {
  const t = useTranslations('Newsletter')

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-[60px] p-10 md:p-20 border border-white/10 text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-outfit font-black text-white">
              {t('title')}
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              name="email"
              type="email" 
              placeholder={t('placeholder')}
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 font-medium"
              required
            />
            <button 
              type="submit"
              className="px-10 py-5 bg-secondary text-primary font-black rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {t('cta')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
