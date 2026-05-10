'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface ShopCardProps {
  shop: {
    id: string
    name: string
    slug: string
    logo: string | null
    country: string | null
    _count: { products: number }
  }
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-xl transition-all"
    >
      <Link href={`/shop/${shop.slug}`} className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border-2 border-border group-hover:border-secondary transition-colors">
          {shop.logo ? (
            <Image 
              src={shop.logo}
              alt={shop.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-xs">
              LOGO
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-bold text-primary truncate text-lg group-hover:text-secondary transition-colors">
              {shop.name}
            </h3>
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wider font-bold">
              {shop.country || 'International'}
            </span>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full w-fit font-medium text-muted-foreground group-hover:bg-primary/5 transition-colors">
              {shop._count.products} produits
            </span>
          </div>
        </div>
        
        <div className="bg-muted p-2 rounded-xl group-hover:bg-secondary group-hover:text-primary transition-all">
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
        </div>
      </Link>
    </motion.div>
  )
}
