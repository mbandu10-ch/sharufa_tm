'use client'

import React from 'react'
import { Link } from '@/lib/i18n-navigation'
import { 
  Zap, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  ShoppingBag,
  Star,
  ChevronRight
} from 'lucide-react'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@sharufa/ui/components/badge'
import { useTranslations } from 'next-intl'

interface MarketplaceMobileDiscoveryProps {
  featuredProducts: any[]
  newArrivals: any[]
  topSales: any[]
}

export function MarketplaceMobileDiscovery({
  featuredProducts,
  newArrivals,
  topSales
}: MarketplaceMobileDiscoveryProps) {
  const t = useTranslations('MobileDiscovery')
  
  return (
    <div className="lg:hidden space-y-10 pb-20">
      {/* 2. Flash Deals / Hero Offers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-secondary fill-secondary" />
            <h3 className="text-lg font-black font-outfit text-primary uppercase italic">
              {t('flash_sales').split(' ')[0]} <span className="text-secondary">{t('flash_sales').split(' ').slice(1).join(' ')}</span>
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-secondary uppercase bg-secondary/10 px-3 py-1 rounded-full">
            <span className="animate-pulse">{t('live')}</span> 
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
          {featuredProducts.map((product) => (
            <Link 
              key={product.id} 
              href={`/product/${product.slug}`}
              className="w-40 shrink-0 bg-white rounded-3xl overflow-hidden border border-border shadow-sm"
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">-30%</div>
              </div>
              <div className="p-3 space-y-1">
                <h4 className="text-[11px] font-bold text-primary line-clamp-1">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-primary">$ {product.price.toFixed(0)}</span>
                  <span className="text-[9px] text-muted-foreground line-through">$ {(product.price * 1.3).toFixed(0)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Trending / Best Sellers */}
      <section className="bg-primary/5 py-10">
        <div className="px-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              <h3 className="text-lg font-black font-outfit text-primary uppercase italic">
                {t('top_trends').split(' ')[0]} <span className="text-secondary">{t('top_trends').split(' ').slice(1).join(' ')}</span>
              </h3>
            </div>
            <Link href="/marketplace?view=products" className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
              {t('see_all')} <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {topSales.slice(0, 4).map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.slug}`}
                className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-border shadow-sm group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] font-bold text-primary line-clamp-1">{product.name}</h4>
                  <p className="text-xs font-black text-secondary">$ {product.price.toFixed(0)}</p>
                  <div className="flex items-center gap-0.5 text-[8px] text-muted-foreground font-bold">
                    <Star size={8} className="fill-secondary text-secondary" /> 4.9
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. New Arrivals - SHEIN Style Grid */}
      <section className="px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-secondary" />
            <h3 className="text-lg font-black font-outfit text-primary uppercase italic">
                {t('new_arrivals').split(' ')[0]} <span className="text-secondary">{t('new_arrivals').split(' ').slice(1).join(' ')}</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {newArrivals.map((product) => (
            <Link 
              key={product.id} 
              href={`/product/${product.slug}`}
              className="flex flex-col bg-white rounded-[28px] overflow-hidden border border-border/50 shadow-sm"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                <Badge className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-primary border-none text-[8px] font-black px-2 py-0.5">
                  {product.originCountry?.code} {product.originCountry?.flag}
                </Badge>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-[11px] font-bold text-primary line-clamp-1">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-primary">$ {product.price.toFixed(2)}</span>
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <ShoppingBag size={14} />
                  </div>
                </div>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest border-t pt-2 truncate">
                   {product.shop?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Custom Buy For Me Premium CTA */}
      <section className="px-4">
         <div className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary rounded-full blur-[80px] opacity-20 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-4">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-secondary">
                  <ShoppingBag size={20} />
               </div>
               <h3 className="text-xl font-outfit font-black leading-tight">
                  {t('not_finding_title').split('?')[0]} <br/>
                  <span className="text-secondary italic">?</span>
               </h3>
               <p className="text-[10px] text-white/60 font-medium leading-relaxed">
                  {t('sourcing_desc')}
               </p>
               <Link 
                 href="/buy-for-me"
                 className="block w-full py-4 bg-secondary text-primary text-center font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl scale-100 hover:scale-105 transition-transform"
               >
                  {t('start_sourcing')}
               </Link>
            </div>
         </div>
      </section>
    </div>
  )
}
