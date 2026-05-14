'use client'

import React, { useRef } from 'react'
import { Link } from '@/lib/i18n-navigation'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Images génériques pour illustrer les différentes catégories (boucle si plus de catégories que d'images)
const defaultImages = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=300', // mode femme
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=300', // mode homme
  'https://images.unsplash.com/photo-1519704943960-da38cf91bdff?auto=format&fit=crop&q=80&w=300', // enfant
  'https://images.unsplash.com/photo-1548036654-3d603718129e?auto=format&fit=crop&q=80&w=300', // accessoires
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300', // tech
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=300', // info
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300', // maison
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=300', // beaute
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=300', // auto
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=300', // brico
  'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=300', // epicerie
  'https://images.unsplash.com/photo-1584820927498-cafe2c1c8631?auto=format&fit=crop&q=80&w=300', // hygiene
]

export function MarketplaceCategoryGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 500 // Ajustez la distance de défilement
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Extraction de TOUTES les sous-catégories depuis les groupes principaux
  const allItems = NAVIGATION_GROUPS.flatMap(group => 
    group.items.map(item => ({
      ...item,
      groupSlug: group.id
    }))
  )

  return (
    <section className="py-8 bg-white relative group/section overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-black font-outfit text-primary uppercase italic">
            Parcourir par <span className="text-secondary">catégorie</span>
          </h2>
        </div>
        
        {/* Bouton de défilement Gauche */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 lg:left-4 top-[60%] -translate-y-1/2 z-20 w-10 h-10 bg-white border border-border shadow-xl rounded-full flex items-center justify-center text-primary opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Conteneur défilant horizontalement sur 3 lignes */}
        <div 
          ref={scrollContainerRef}
          className="grid grid-rows-3 grid-flow-col auto-cols-max gap-y-6 gap-x-4 md:gap-x-8 pb-4 overflow-x-auto scrollbar-hide snap-x scroll-smooth relative z-10"
        >
          {allItems.map((item, index) => {
             // Utiliser le premier slug de la catégorie pour l'image d'illustration
             const primarySlug = item.categorySlugs[0]
             const img = `/categories/${primarySlug}.webp`
             
             return (
              <Link 
                key={`${item.groupSlug}-${item.id}`} 
                href={`/marketplace?group=${item.groupSlug}&item=${item.id}`}
                className="group flex flex-col items-center gap-3 shrink-0 snap-start w-20 md:w-28"
              >
                {/* Bulle d'image */}
                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-secondary transition-all duration-500 shadow-sm group-hover:shadow-secondary/20 group-hover:scale-105">
                  <img 
                    src={img} 
                    alt={item.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={(e) => {
                      // Fallback si l'image spécifique n'existe pas
                      (e.target as HTMLImageElement).src = defaultImages[index % defaultImages.length]
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                {/* Texte de la catégorie */}
                <span className="text-[10px] md:text-xs font-black uppercase tracking-tight text-primary group-hover:text-secondary transition-colors text-center w-20 md:w-28 line-clamp-2 leading-tight">
                  {item.name}
                </span>
              </Link>
             )
          })}
        </div>

        {/* Bouton de défilement Droite */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 lg:right-4 top-[60%] -translate-y-1/2 z-20 w-10 h-10 bg-white border border-border shadow-xl rounded-full flex items-center justify-center text-primary opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  )
}
