import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  shopName: string
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size?: string, color?: string) => void
  clearCart: () => void
  setIsOpen: (isOpen: boolean) => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => 
          item.id === product.id && 
          item.selectedSize === product.selectedSize && 
          item.selectedColor === product.selectedColor
        )
        
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              (item.id === product.id && 
               item.selectedSize === product.selectedSize && 
               item.selectedColor === product.selectedColor)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true
          })
        } else {
          set({
            items: [...currentItems, { ...product, quantity: 1 }],
            isOpen: true
          })
        }
      },
      
      removeItem: (id, size, color) => {
        set({
          items: get().items.filter((item) => 
            !(item.id === id && item.selectedSize === size && item.selectedColor === color)
          )
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      setIsOpen: (isOpen) => set({ isOpen }),
      
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'sharufa-cart',
    }
  )
)
