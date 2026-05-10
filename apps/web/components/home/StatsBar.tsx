'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LayoutGrid, Store, Globe, Truck } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface StatsBarProps {
  stats: {
    products: number
    shops: number
    countries: number
  }
}

export function StatsBar({ stats }: StatsBarProps) {
  const t = useTranslations('StatsBar')
  
  const items = [
    { label: t('products'), value: stats.products || '800+', icon: LayoutGrid },
    { label: t('shops'), value: stats.shops || '50+', icon: Store },
    { label: t('countries'), value: stats.countries || '3', icon: Globe },
    { label: 'Door to Door', value: 'Porte à Porte', icon: Truck }, // Keep this or translate too
  ]

  return (
    <div className="bg-primary py-12 rounded-[50px] mx-4 md:mx-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10 group-hover:bg-secondary/20 transition-colors">
                <item.icon className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-3xl md:text-4xl font-outfit font-black text-white mb-1">
                {item.value}
              </div>
              <div className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-[0.2em]">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
