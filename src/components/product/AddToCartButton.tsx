'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCart } from '@/lib/store/useCart'

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
  image: string
  shopName: string
  selectedSize?: string
  selectedColor?: string
  disabled?: boolean
}

export default function AddToCartButton({ 
  productId, 
  productName, 
  price, 
  image, 
  shopName,
  selectedSize,
  selectedColor,
  disabled = false
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCart(state => state.addItem)
  const isSourcing = price === 0

  const handleAction = () => {
    if (isSourcing) {
      window.location.href = `/buy-for-me?title=${encodeURIComponent(productName)}&image=${encodeURIComponent(image)}`
      return
    }

    setIsAdded(true)
    
    addItem({
      id: productId,
      name: productName,
      price,
      image,
      shopName,
      selectedSize,
      selectedColor
    })

    toast.success(`${productName} ajouté au panier !`, {
      description: "Vous pouvez maintenant finaliser votre commande.",
      duration: 3000,
      style: {
        background: '#1A1A1A',
        color: '#D4AF37',
        border: '1px solid #D4AF37'
      }
    })
    
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button 
      onClick={handleAction}
      disabled={isAdded || disabled}
      className={`w-full py-5 md:py-8 rounded-2xl md:rounded-[24px] font-black text-lg md:text-xl shadow-2xl transition-all flex items-center justify-center gap-3 ${
        isAdded 
        ? 'bg-green-600 text-white hover:bg-green-700' 
        : isSourcing
        ? 'bg-secondary text-primary hover:bg-primary hover:text-white'
        : 'bg-primary text-white hover:bg-white hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed'
      }`}
    >
      {isAdded ? (
        <>
          <Check className="w-6 h-6" /> Ajouté !
        </>
      ) : isSourcing ? (
        <>
          <ShoppingBag className="w-6 h-6" /> Demander un Sourcing
        </>
      ) : (
        <>
          <ShoppingBag className="w-6 h-6" /> Ajouter au panier
        </>
      )}
    </Button>
  )
}
