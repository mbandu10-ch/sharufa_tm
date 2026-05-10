'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import AddToCartButton from './AddToCartButton'
import { cn } from '@/lib/utils'

interface ProductInteractionProps {
  product: {
    id: string
    name: string
    price: number
    images: string[]
    shop: { name: string } | null
    sizes: string[]
    colors: string[]
  }
}

export default function ProductInteraction({ product }: ProductInteractionProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')

  const needsSize = product.sizes && product.sizes.length > 0
  const needsColor = product.colors && product.colors.length > 0
  
  const canAddToCart = (!needsSize || selectedSize) && (!needsColor || selectedColor)

  return (
    <div className="space-y-8">
      {/* Selection de Tailles */}
      {needsSize && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/50 italic">Sélectionner la Taille</h4>
            {selectedSize && <span className="text-[10px] font-bold text-secondary uppercase">Choisi: {selectedSize}</span>}
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "min-w-[56px] h-14 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center px-4",
                  selectedSize === size
                    ? "bg-primary border-primary text-white shadow-lg scale-105"
                    : "bg-white border-slate-100 text-primary hover:border-secondary hover:text-secondary"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection de Couleurs */}
      {needsColor && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/50 italic">Sélectionner la Couleur</h4>
            {selectedColor && <span className="text-[10px] font-bold text-secondary uppercase">Choisi: {selectedColor}</span>}
          </div>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "h-14 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center px-6 gap-2",
                  selectedColor === color
                    ? "bg-primary border-primary text-white shadow-lg scale-105"
                    : "bg-white border-slate-100 text-primary hover:border-secondary hover:text-secondary"
                )}
              >
                {selectedColor === color && <Check size={14} className="text-secondary" />}
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        {!canAddToCart && (needsSize || needsColor) && (
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4 animate-pulse">
            Veuillez sélectionner {needsSize && !selectedSize ? 'une taille' : ''} {needsSize && !selectedSize && needsColor && !selectedColor ? 'et' : ''} {needsColor && !selectedColor ? 'une couleur' : ''} pour continuer.
          </p>
        )}
        <AddToCartButton 
          productId={product.id} 
          productName={product.name} 
          price={product.price}
          image={product.images[0]}
          shopName={product.shop?.name || 'Sharufa Store'}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          disabled={!canAddToCart}
        />
      </div>
    </div>
  )
}
