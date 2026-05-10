'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Globe, Store, Truck, ShieldCheck } from 'lucide-react'
import { Link } from '@/lib/i18n-navigation'
import { useTranslations } from 'next-intl'

export function FeaturesSection() {
  const t = useTranslations('Features')

  const features = [
    {
      title: t('sourcing_title'),
      description: t('sourcing_desc'),
      icon: Globe,
      color: 'bg-emerald-500/10 text-emerald-500',
      href: '/buy-for-me'
    },
    {
      title: t('marketplace_title'),
      description: t('marketplace_desc'),
      icon: Store,
      color: 'bg-secondary/10 text-secondary',
      href: '/marketplace'
    },
    {
      title: t('shipping_title'),
      description: t('shipping_desc'),
      icon: Truck,
      color: 'bg-blue-500/10 text-blue-500',
      href: '/logistics'
    },
    {
      title: t('secure_title'),
      description: t('secure_desc'),
      icon: ShieldCheck,
      color: 'bg-purple-500/10 text-purple-500',
      href: '/about'
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-outfit font-bold text-primary mb-6">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground italic">
            {t('quote')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="p-8 bg-background rounded-3xl shadow-sm border border-border hover:shadow-xl hover:border-secondary transition-all"
            >
              <Link href={feature.href} className="block h-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
