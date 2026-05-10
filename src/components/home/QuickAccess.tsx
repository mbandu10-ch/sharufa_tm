'use client'

import React from 'react'
import { Link } from '@/lib/i18n-navigation'
import { ShoppingBag, Store, Globe, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function QuickAccess() {
  const t = useTranslations('QuickAccess')
  
  const quickLinks = [
    {
      name: t('explore_all'),
      href: '/marketplace',
      icon: ShoppingBag,
      description: t('explore_all_desc'),
      color: 'bg-emerald-500/10 text-emerald-500'
    },
    {
      name: t('buy_for_me'),
      href: '/buy-for-me',
      icon: Zap,
      description: t('buy_for_me_desc'),
      color: 'bg-secondary/10 text-secondary'
    },
    {
      name: t('browse_shops'),
      href: '/marketplace?view=shops',
      icon: Store,
      description: t('browse_shops_desc'),
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      name: t('by_destination'),
      href: '/marketplace?view=countries',
      icon: Globe,
      description: t('by_destination_desc'),
      color: 'bg-purple-500/10 text-purple-500'
    }
  ]

  return (
    <section className="py-8 bg-background relative z-30 -mt-12 mb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, idx) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                href={link.href}
                className="group flex flex-col items-center p-6 bg-white border border-border rounded-3xl shadow-sm hover:shadow-xl hover:border-secondary transition-all text-center"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${link.color} transition-transform`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-primary text-sm md:text-base mb-1">{link.name}</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  {link.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
