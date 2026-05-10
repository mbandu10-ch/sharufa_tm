'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Star, ArrowRight, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

interface Shop {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  banner: string | null
  country: string | null
  type: string
  isVerified: boolean
  _count: {
    products: number
  }
  products: { id: string; name: string; images: string[] }[]
}

interface ShopGridProps {
  shops: Shop[]
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export function ShopGrid({ shops }: ShopGridProps) {
  if (shops.length === 0) return null

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      {shops.map((shop) => (
        <motion.div key={shop.id} variants={item}>
          <Link 
            href={`/shop/${shop.slug}`}
            className="group block bg-background rounded-[48px] overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative h-72 overflow-hidden">
              <motion.img 
                src={shop.banner || shop.logo || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=600'} 
                alt={shop.name} 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
              
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <Badge className="bg-white/95 text-primary font-black px-4 py-2 rounded-full backdrop-blur-md border-none shadow-xl text-[10px] tracking-widest">
                  {shop.country === 'Émirats arabes unis' ? '🇦🇪 UAE' : shop.country === 'Turquie' ? '🇹🇷 TUR' : '🌍 ' + shop.country}
                </Badge>
                {shop.isVerified && (
                  <Badge className="bg-secondary text-primary font-black px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-1.5 border-none shadow-xl text-[10px] tracking-widest">
                    <Star className="w-3.5 h-3.5 fill-primary" /> VÉRIFIÉ
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
                <div className="flex items-center gap-3">
                  {shop.type === 'WHOLESALE_STORE' ? (
                    <Badge className="bg-secondary text-primary border-none font-black text-[9px] px-3 py-1 tracking-tighter shadow-lg">GROSSISTE (B2B)</Badge>
                  ) : (
                    <Badge className="bg-white/30 text-white border-none font-black text-[9px] px-3 py-1 tracking-tighter backdrop-blur-md">BOUTIQUE DÉTAIL</Badge>
                  )}
                  <span className="flex items-center gap-2 ml-auto text-[11px] font-black text-secondary uppercase tracking-widest">
                    <Package size={14} className="stroke-[3]" /> {shop._count.products} Produits
                  </span>
                </div>
                <h3 className="text-3xl font-black font-outfit tracking-tight leading-tight group-hover:text-secondary transition-colors duration-300">{shop.name}</h3>
              </div>
            </div>

            <CardContent className="p-8 space-y-6">
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed font-medium opacity-80">
                {shop.description}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <div className="flex -space-x-3">
                  {shop.products.slice(0, 3).map((p, i) => (
                    <div key={i} className="w-14 h-14 rounded-2xl border-2 border-background overflow-hidden shadow-lg bg-muted z-[3]">
                      <div className="relative w-full h-full">
                        <Image 
                          src={p.images[0]} 
                          alt={p.name} 
                          fill
                          sizes="56px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                    </div>
                  ))}
                  {shop._count.products > 3 && (
                     <div className="w-14 h-14 rounded-2xl border-2 border-background flex items-center justify-center bg-muted text-[10px] font-black text-muted-foreground z-[0] pl-2">
                        +{shop._count.products - 3}
                     </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                        Visiter
                    </span>
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                        <ArrowRight size={18} className="stroke-[3]" />
                    </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
