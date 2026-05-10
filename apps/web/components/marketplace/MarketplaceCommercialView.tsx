'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingBag, TrendingUp, Sparkles, Globe, Zap, Heart, Star, Store, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/home/ProductCard'
import { Button } from '@sharufa/ui/components/button'
import { Badge } from '@sharufa/ui/components/badge'
import { NAVIGATION_GROUPS } from '@/lib/navigation'

interface MarketplaceCommercialViewProps {
  featuredProducts: any[]
  newArrivals: any[]
  topSales: any[]
}

export function MarketplaceCommercialView({ 
  featuredProducts, 
  newArrivals, 
  topSales 
}: MarketplaceCommercialViewProps) {
  
  // Popular categories to show (subset of groups)
  const popularGroups = NAVIGATION_GROUPS.slice(0, 6)

  return (
    <div className="space-y-24">
      {/* 1. Hero Commercial / Spotlight */}
      <section className="relative rounded-[40px] md:rounded-[60px] overflow-hidden bg-primary text-white p-8 md:p-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 skew-x-12 transform translate-x-1/4" />
        <div className="relative z-10 max-w-3xl space-y-8">
          <Badge className="bg-secondary text-primary font-black px-4 py-1 rounded-full uppercase tracking-tighter text-[10px]">
            Exclusivité Sharufa
          </Badge>
          <h2 className="text-4xl md:text-6xl font-outfit font-black tracking-tight leading-[0.9]">
            Accédez aux meilleurs <br/>
            <span className="text-secondary italic">fournisseurs mondiaux.</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg md:text-xl font-medium max-w-xl">
            Plus besoin de voyager pour sourcer vos produits. Nous avons sélectionné pour vous l'excellence de Dubaï, Turquie et Chine.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-primary hover:bg-secondary hover:text-primary font-black px-8 py-6 rounded-2xl transition-all">
              Découvrir les offres
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-black px-8 py-6 rounded-2xl">
              Devenir Vendeur
            </Button>
          </div>
        </div>
        
        {/* Abstract visual elements */}
        <div className="absolute bottom-10 right-10 hidden lg:block">
           <div className="grid grid-cols-2 gap-4">
              <div className="w-32 h-32 bg-secondary/20 rounded-3xl backdrop-blur-xl border border-white/10 animate-pulse" />
              <div className="w-32 h-48 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 mt-8" />
              <div className="w-48 h-32 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10 -mt-16" />
           </div>
        </div>
      </section>

      {/* 2. Country Selection - Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-10">
           <h3 className="text-2xl md:text-4xl font-outfit font-black tracking-tight text-primary">
              Sélection par <span className="text-secondary">Destination</span>
           </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Dubaï (UAE)', code: 'AE', color: 'bg-[#FFD700]', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600', tag: 'Luxe & Tech' },
            { name: 'Turquie', code: 'TR', color: 'bg-[#E30A17]', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=600', tag: 'Textile & Cuir' },
            { name: 'Chine', code: 'CN', color: 'bg-[#EE1C25]', image: 'https://images.unsplash.com/photo-1508433957232-41487cc5652f?auto=format&fit=crop&q=80&w=600', tag: 'Industrie & Gadgets' },
          ].map((country, i) => (
            <Link 
              key={country.code} 
              href={`/marketplace?country=${country.code}`}
              className="group relative h-80 rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <Image 
                src={country.image} 
                alt={country.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                 <Badge className="bg-secondary text-primary font-bold px-3 py-1 rounded-full text-[10px]">
                   {country.tag}
                 </Badge>
                 <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-black text-white font-outfit uppercase tracking-tight">{country.name}</h4>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-secondary group-hover:text-primary transition-all">
                       <ArrowRight size={20} />
                    </div>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section>
        <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
           <div className="space-y-1">
             <h3 className="text-2xl md:text-4xl font-outfit font-black tracking-tight text-primary">
                Produits <span className="text-secondary">Vedettes</span>
             </h3>
             <p className="text-muted-foreground font-medium text-sm">Une sélection exclusive certifiée par Sharufa.</p>
           </div>
           <Link href="/marketplace?view=products" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
              Tout voir <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
           </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Popular Categories - Visual Tiles */}
      <section className="bg-muted/30 -mx-4 px-4 py-20 rounded-[60px]">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h3 className="text-3xl md:text-5xl font-outfit font-black tracking-tight text-primary uppercase italic">
                Univers <span className="text-secondary">Populaires</span>
             </h3>
             <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto">
                Explorez nos univers les plus demandés et trouvez les meilleures opportunités B2B & B2C.
             </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularGroups.map((group, i) => {
              const Icon = group.icon
              return (
                <Link 
                  key={group.id} 
                  href={`/marketplace?group=${group.id}`}
                  className="group flex flex-col items-center gap-4 p-6 bg-white rounded-[40px] border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-center"
                >
                  <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight text-primary">
                    {group.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. New Arrivals & Top Sales Tabs/Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
         {/* New Arrivals */}
         <section className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black font-outfit text-primary flex gap-2 items-center">
                  <Zap size={24} className="text-secondary" /> Nouveautés
               </h3>
               <Link href="/marketplace?view=products" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Explorer</Link>
            </div>
            <div className="space-y-4">
               {newArrivals.slice(0, 3).map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-border/50 hover:shadow-md transition-all group"
                  >
                     <div className="w-20 h-20 relative rounded-2xl overflow-hidden bg-muted">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="80px" />
                     </div>
                     <div className="flex-grow">
                        <p className="text-[10px] font-black text-secondary uppercase tracking-tighter">{product.category.name}</p>
                        <h4 className="font-bold text-primary line-clamp-1">{product.name}</h4>
                        <p className="text-lg font-black text-primary">$ {product.price.toFixed(2)}</p>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-secondary group-hover:text-primary transition-all">
                        <ArrowRight size={18} />
                     </div>
                  </Link>
               ))}
            </div>
         </section>

         {/* Top Sales / Opportunities */}
         <section className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black font-outfit text-primary flex gap-2 items-center">
                  <TrendingUp size={24} className="text-secondary" /> Top Ventes
               </h3>
               <Link href="/marketplace?view=products" className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Tout voir</Link>
            </div>
            <div className="space-y-4">
               {topSales.slice(0, 3).map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-border/50 hover:shadow-md transition-all group"
                  >
                     <div className="w-20 h-20 relative rounded-2xl overflow-hidden bg-muted">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="80px" />
                     </div>
                     <div className="flex-grow">
                        <p className="text-[10px] font-black text-secondary uppercase tracking-tighter">{product.shop?.name}</p>
                        <h4 className="font-bold text-primary line-clamp-1">{product.name}</h4>
                        <div className="flex items-center gap-2">
                           <p className="text-lg font-black text-primary">$ {product.price.toFixed(2)}</p>
                           <Badge variant="secondary" className="text-[9px] font-black px-1.5 py-0">Hot</Badge>
                        </div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-secondary group-hover:text-primary transition-all">
                        <ArrowRight size={18} />
                     </div>
                  </Link>
               ))}
            </div>
         </section>
      </div>

      {/* 6. Sourcing CTA / Buy For Me */}
      <section className="relative p-1 bg-[#1a1a1a] rounded-[50px] md:rounded-[80px] overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-secondary/10 opacity-50 group-hover:opacity-70 transition-opacity" />
         <div className="relative z-10 bg-[#111] rounded-[48px] md:rounded-[78px] p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/5">
            <div className="max-w-2xl space-y-8 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Service Premium</span>
               </div>
               <h2 className="text-4xl md:text-7xl font-outfit font-black leading-[0.8] text-white uppercase tracking-tighter">
                  Vous ne trouvez pas <br/>
                  <span className="text-secondary italic">votre bonheur ?</span>
               </h2>
               <p className="text-xl md:text-2xl text-white/50 font-medium leading-snug">
                  Utilisez notre service <strong>Buy For Me</strong>. Envoyez-nous une photo ou un lien, nous négocions et expédions pour vous.
               </p>
            </div>
            
            <Link 
              href="/buy-for-me"
              className="group relative px-12 py-8 bg-secondary text-primary font-black rounded-full text-2xl shadow-2xl hover:bg-white transition-all overflow-hidden flex items-center gap-4"
            >
               <span className="relative z-10">Lancer un Sourcing</span>
               <ArrowRight className="relative z-10 w-8 h-8 transition-transform group-hover:translate-x-2" />
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
         </div>
      </section>

      {/* Final space */}
      <div className="pb-12" />
    </div>
  )
}
