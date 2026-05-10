'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n-navigation'
import { ArrowRight, ShoppingBag, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    shop: { name: string; slug: string } | null
    originCountry: { name: string; code: string } | null
    isSharufa?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] || '/images/placeholders/product.jpg'
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl md:rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all"
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted">
        <Image 
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-contain"
        />
        
        {/* Country Badge */}
        {product.originCountry && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
            <Badge className="bg-white/90 backdrop-blur-md text-primary border-none flex items-center gap-1 font-bold py-0.5 px-1.5 md:py-1 md:px-2 rounded-full shadow-sm">
              <span className="text-[8px] md:text-xs">{product.originCountry.code}</span>
            </Badge>
          </div>
        )}

        {/* Sharufa Badge */}
        {product.isSharufa && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
            <Badge className="bg-secondary text-primary border-none font-black text-[7px] md:text-[10px] py-0.5 px-1.5 md:py-1 md:px-3 rounded-full shadow-lg">
              PREMIUM
            </Badge>
          </div>
        )}
      </Link>

      <div className="p-3 md:p-5 space-y-2 md:space-y-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-2">
          <Link href={`/product/${product.slug}`} className="flex-1">
            <h3 className="font-bold text-primary text-xs md:text-base truncate group-hover:text-secondary transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="font-outfit font-black text-secondary text-sm md:text-base whitespace-nowrap">
            $ {product.price.toLocaleString('en-US')}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          {product.shop && (
            <Link 
              href={`/shop/${product.shop.slug}`}
              className="text-[8px] md:text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 bg-muted/50 px-2 py-0.5 md:py-1 rounded-full transition-colors truncate max-w-[80%]"
            >
              <MapPin className="w-2 h-2 md:w-3 md:h-3 text-secondary" />
              {product.shop.name}
            </Link>
          )}
          <ArrowRight className="hidden md:block w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  )
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}
