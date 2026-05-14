'use client'

import React, { useState, useEffect } from 'react'
import { Link } from '@/lib/i18n-navigation'
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MarketplaceSheinHero({ products }: { products: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!products || products.length === 0) return null

  // On s'assure d'avoir assez d'éléments pour remplir les grilles (minimum 10)
  // en dupliquant si nécessaire (au cas où la base de données est vide)
  const safeProducts = [...products, ...products, ...products, ...products].slice(0, 10)
  
  const leftProducts = safeProducts.slice(0, 3)
  const carouselProducts = safeProducts.slice(3, 7)
  const rightProducts = safeProducts.slice(7, 10)

  useEffect(() => {
    if (carouselProducts.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselProducts.length)
    }, 5000) // Défilement toutes les 5 secondes
    return () => clearInterval(timer)
  }, [carouselProducts.length])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % carouselProducts.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length)

  return (
    <div className="container mx-auto px-4 lg:px-0 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* Colonne Gauche - 3 bannières superposées */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-2">
          {leftProducts.map((p, i) => (
            <Link key={`left-${i}`} href={`/product/${p.slug}`} className="relative flex-1 rounded-sm overflow-hidden group cursor-pointer bg-white border border-border flex items-center justify-between p-4 hover:shadow-md transition-all">
              <div className="z-10 w-1/2">
                <span className="text-primary font-black text-sm uppercase tracking-tighter leading-tight line-clamp-2 bg-gradient-to-r from-white via-white to-transparent py-1">{p.name}</span>
                <div className="mt-2 bg-secondary text-primary px-2 py-0.5 rounded-full inline-block text-[10px] font-bold">
                  $ {p.price.toFixed(2)}
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-2/3">
                 <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10" />
                 <img 
                   src={p.images[0] || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=300'} 
                   alt={p.name}
                   className="w-full h-full object-contain object-right p-2 transition-transform duration-500 group-hover:scale-105"
                 />
              </div>
            </Link>
          ))}
        </div>

        {/* Carrousel Central Principal */}
        <div className="lg:col-span-6 relative aspect-video lg:aspect-auto rounded-sm overflow-hidden group">
          {carouselProducts.map((p, i) => (
            <div 
              key={`center-${i}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              )}
            >
              {/* Image floutée en arrière-plan pour l'esthétique */}
              <img 
                src={p.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200'} 
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-60 scale-110"
              />
              {/* Image principale non rognée */}
              <img 
                src={p.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200'} 
                alt={p.name}
                className="relative w-full h-full object-contain p-4 md:p-8"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-start p-8 md:p-12 text-white">
                <div className="bg-primary/80 backdrop-blur-sm px-4 py-1.5 rounded-sm mb-4 inline-flex items-center gap-2">
                   <Zap size={16} className="text-secondary fill-secondary" />
                   <span className="text-white font-bold text-xs tracking-widest uppercase">Offre Flash</span>
                </div>
                
                <div className="bg-[#428160] px-6 py-3 rounded-sm my-6 shadow-xl transform transition-transform hover:scale-105">
                   <span className="text-white text-xl md:text-3xl font-black italic tracking-tight">
                     À PARTIR DE $ {p.price.toFixed(2)}
                   </span>
                </div>
                
                <Link href={`/product/${p.slug}`} className="bg-black text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-secondary hover:text-primary transition-colors flex items-center gap-2">
                  Achetez Maintenant <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}

          {/* Contrôles du carrousel */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/50 hover:bg-white text-primary flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/50 hover:bg-white text-primary flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all shadow-md"
          >
            <ChevronRight size={20} />
          </button>

          {/* Points de navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {carouselProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </div>

        {/* Colonne Droite - 3 bannières superposées */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-2">
          {rightProducts.map((p, i) => (
            <Link key={`right-${i}`} href={`/product/${p.slug}`} className="relative flex-1 rounded-sm overflow-hidden group cursor-pointer bg-white border border-border flex items-center justify-between p-4 hover:shadow-md transition-all">
              <div className="z-10 w-1/2">
                <span className="text-primary font-black text-sm uppercase tracking-tighter leading-tight line-clamp-2 bg-gradient-to-r from-white via-white to-transparent py-1">{p.name}</span>
                <div className="mt-2 bg-secondary text-primary px-2 py-0.5 rounded-full inline-block text-[10px] font-bold">
                  $ {p.price.toFixed(2)}
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-2/3">
                 <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10" />
                 <img 
                   src={p.images[0] || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=300'} 
                   alt={p.name}
                   className="w-full h-full object-contain object-right p-2 transition-transform duration-500 group-hover:scale-105"
                 />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
