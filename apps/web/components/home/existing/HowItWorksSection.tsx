'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function HowItWorksSection() {
  const t = useTranslations('HowItWorks')

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-outfit font-bold text-primary leading-tight">
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Block 1: Support */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[40px] bg-muted/50 border border-border"
          >
            <div className="relative h-[300px] md:h-[400px]">
              <Image 
                src="/images/marketing/support.jpg" 
                alt={t('step2_title')} 
                fill 
                className="object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="text-3xl font-outfit font-bold text-white mb-4">{t('step2_title')}</h3>
                <p className="text-white/80 text-lg leading-relaxed max-w-md">
                  {t('step2_desc')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Block 2: Warehouse */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-[40px] bg-muted/50 border border-border"
          >
            <div className="relative h-[300px] md:h-[400px]">
              <Image 
                src="/images/marketing/warehouse.jpg" 
                alt={t('step3_title')} 
                fill 
                className="object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="text-3xl font-outfit font-bold text-white mb-4">{t('step3_title')}</h3>
                <p className="text-white/80 text-lg leading-relaxed max-w-md">
                  {t('step3_desc')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
