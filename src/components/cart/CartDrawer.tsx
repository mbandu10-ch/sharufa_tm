'use client'

import { useCart } from '@/lib/store/useCart'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet'
import { ShoppingBag, X, Trash2, ArrowRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, totalPrice, totalItems } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md border-l-2 bg-background p-0 flex flex-col">
        <SheetHeader className="p-8 border-b bg-primary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-secondary h-6 w-6" />
              <SheetTitle className="text-white font-black uppercase tracking-widest text-xl">
                Mon Panier
              </SheetTitle>
            </div>
            <div className="bg-secondary text-primary px-3 py-1 rounded-full text-xs font-black">
              {totalItems()} article{totalItems() > 1 ? 's' : ''}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <Package size={48} />
              </div>
              <div className="space-y-2">
                <p className="font-black text-xl uppercase tracking-tighter">Votre panier est vide</p>
                <p className="text-sm font-medium">Commencez vos achats sur la marketplace Sharufa.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}-${idx}`} className="group relative flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-transparent hover:border-secondary/20 transition-all">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1 truncate">
                      {item.shopName}
                    </p>
                    <h4 className="font-black text-primary text-sm line-clamp-2 leading-tight mb-1">
                      {item.name}
                    </h4>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.selectedSize && (
                        <span className="text-[9px] font-black uppercase tracking-tighter bg-white border px-2 py-0.5 rounded-full text-muted-foreground">
                          Taille: <span className="text-primary">{item.selectedSize}</span>
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-[9px] font-black uppercase tracking-tighter bg-white border px-2 py-0.5 rounded-full text-muted-foreground">
                          Couleur: <span className="text-primary">{item.selectedColor}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-black text-lg text-primary">{item.price.toFixed(2)} $</p>
                      <span className="text-xs font-bold text-muted-foreground bg-white px-2 py-1 rounded-lg border">
                        Qte: {item.quantity}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-red-50 text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-8 border-t bg-slate-50 flex flex-col gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-muted-foreground text-sm font-bold uppercase tracking-widest">
                <span>Sous-total</span>
                <span>{totalPrice().toFixed(2)} $</span>
              </div>
              <div className="flex justify-between items-center text-primary text-2xl font-black">
                <span>TOTAL</span>
                <span>{totalPrice().toFixed(2)} $</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full" onClick={() => setIsOpen(false)}>
              <Button className="w-full py-8 rounded-3xl bg-primary text-white font-black text-lg uppercase tracking-widest shadow-xl hover:bg-secondary hover:text-primary transition-all group">
                Finaliser la commande
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">
              Taxes et frais de port calculés à l'étape suivante
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
