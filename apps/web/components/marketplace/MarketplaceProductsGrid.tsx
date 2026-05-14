'use client'

import React, { useRef } from 'react'
import { Link } from '@/lib/i18n-navigation'
import { ChevronLeft, ChevronRight, ShoppingBag, Search, Store, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MarketplaceProductsGrid({ products, isHomeView }: { products: any[], isHomeView: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // Défilement équivalent à presque la largeur de l'écran pour plus de confort
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <Package className="mx-auto w-16 h-16 text-muted-foreground opacity-20" />
        <p className="text-xl text-muted-foreground font-medium">Aucun produit trouvé</p>
      </div>
    )
  }

  return (
    <div className={cn("relative group/products", isHomeView && "hidden lg:block")}>
      {/* Bouton Gauche */}
      <button 
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-border shadow-2xl rounded-full flex items-center justify-center text-primary opacity-0 group-hover/products:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Grille sur 3 Lignes avec défilement horizontal */}
      <div 
        ref={scrollRef}
        className="grid grid-rows-3 grid-flow-col gap-y-8 gap-x-6 pb-8 overflow-x-auto scrollbar-hide snap-x scroll-smooth relative z-10"
        // 5 colonnes visibles : 100% / 5 = 20%. Moins la taille des espaces (gap-6 = 24px). (4 * 24) / 5 = 19.2px
        style={{ gridAutoColumns: 'calc(20% - 19.2px)' }} 
      >
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.slug}`}
            className="group bg-white overflow-hidden flex flex-col snap-start transition-opacity hover:opacity-95"
          >
            {/* Image du produit - Format Portrait (Style SHEIN) */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
              <img 
                src={product.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400'} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badge Pays (Optionnel, en haut à gauche) */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="bg-white/80 backdrop-blur-sm text-[10px] font-bold text-primary px-1.5 py-0.5 rounded-sm shadow-sm">
                  {product.originCountry?.flag} {product.originCountry?.code}
                </span>
              </div>
            </div>
            
            {/* Informations du produit */}
            <div className="pt-3 pb-1 px-1 flex-grow flex flex-col justify-between">
              <div className="space-y-1">
                {/* Titre / Description */}
                <h3 className="text-xs font-normal text-primary line-clamp-1 leading-tight hover:underline">
                  {product.name}
                </h3>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                {/* Prix */}
                {product.price > 0 ? (
                  <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground uppercase">Sur demande</span>
                )}

                {/* Bouton Panier */}
                <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ShoppingBag size={14} />
                </div>
              </div>

              {/* Vendeur (Optionnel, très discret) */}
              <div className="mt-2 flex items-center gap-1 text-[9px] text-muted-foreground truncate">
                 <Store size={10} className="shrink-0" /> {product.shop?.name}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bouton Droite */}
      <button 
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-border shadow-2xl rounded-full flex items-center justify-center text-primary opacity-0 group-hover/products:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  )
}
