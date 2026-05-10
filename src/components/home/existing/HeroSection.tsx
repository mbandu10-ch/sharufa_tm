'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n-navigation'
import { motion } from 'framer-motion'

export function HeroSection() {
  const t = useTranslations('Hero')

  return (
    <section className="relative min-h-[80vh] flex items-center pt-20 pb-32 overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/marketing/delivery-hero.jpg"
          alt="Sharufa Delivery Services"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-full font-bold text-sm tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              {t('badge')}
            </div>
            <h1 className="text-4xl md:text-7xl font-outfit font-black text-white leading-[1.1]">
              {t('title')}<br />
              <span className="text-secondary italic">{t('title_highlight')}</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/80 max-w-xl font-medium leading-relaxed">
              {t('subtitle')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-5"
          >
            <Link 
              href="/marketplace" 
              className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 bg-secondary text-primary font-black rounded-full text-lg sm:text-xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all transform hover:-translate-y-1 text-center"
            >
              {t('cta_marketplace')}
            </Link>
            <Link 
              href="/buy-for-me" 
              className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 bg-white/10 text-white font-bold rounded-full text-lg sm:text-xl backdrop-blur-md hover:bg-white/20 transition-all border border-white/20 text-center"
            >
              {t('cta_sourcing')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
