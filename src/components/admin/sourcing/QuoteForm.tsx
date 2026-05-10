'use client'

import React from 'react'
import { 
  DollarSign, 
  Send, 
  Calculator, 
  Info,
  Archive,
  Truck,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createSourcingQuote } from '@/lib/actions/admin/sourcing/actions'
import { cn } from '@/lib/utils'

interface QuoteFormProps {
  requestId: string
  currentQuote?: any
}

export function QuoteForm({ requestId, currentQuote }: QuoteFormProps) {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [formData, setFormData] = React.useState({
    productCost: currentQuote?.productCost || 0,
    shippingCost: currentQuote?.shippingCost || 0,
    serviceFee: currentQuote?.serviceFee || 0,
    notes: currentQuote?.notes || ''
  })

  const totalPrice = Number(formData.productCost) + Number(formData.shippingCost) + Number(formData.serviceFee)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    
    const res = await createSourcingQuote({
      requestId,
      ...formData,
      productCost: Number(formData.productCost),
      shippingCost: Number(formData.shippingCost),
      serviceFee: Number(formData.serviceFee)
    })

    if (res.success) {
      toast.success("Devis envoyé au client ✅")
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsUpdating(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#002B24] rounded-[40px] p-10 text-white space-y-8 relative overflow-hidden italic shadow-xl shadow-primary/20">
      <Calculator size={120} className="absolute -right-8 -bottom-8 text-white/5 opacity-40 scale-125" />
      
      <div className="relative z-10">
         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-8 italic flex items-center gap-2">
            <Calculator size={16} /> Élaboration du Devis Client
         </h4>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Coût Produit (Unité)</label>
               <div className="relative italic">
                  <Input 
                    type="number"
                    value={formData.productCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, productCost: e.target.value }))}
                    className="bg-white/5 border-white/10 rounded-2xl py-6 pl-6 pr-14 text-white font-black italic focus:ring-secondary focus:border-secondary"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black opacity-40">$</span>
               </div>
            </div>
            <div className="space-y-3 italic">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic tracking-tighter">Frais Logistique (Estimation)</label>
               <div className="relative italic">
                  <Input 
                    type="number"
                    value={formData.shippingCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingCost: e.target.value }))}
                    className="bg-white/5 border-white/10 rounded-2xl py-6 pl-6 pr-14 text-white font-black italic focus:ring-secondary focus:border-secondary"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black opacity-40">$</span>
               </div>
            </div>
            <div className="space-y-3 italic">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic tracking-tighter">Frais de Service (Sharufa Service Fee)</label>
               <div className="relative italic">
                  <Input 
                    type="number"
                    value={formData.serviceFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceFee: e.target.value }))}
                    className="bg-white/5 border-white/10 rounded-2xl py-6 pl-6 pr-14 text-white font-black italic focus:ring-secondary focus:border-secondary"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black opacity-40 italic tracking-tighter">$</span>
               </div>
            </div>
         </div>

         <div className="space-y-3 mb-8 italic">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Notes & Spécifications du devis</label>
            <Textarea 
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Détails sur les délais, conditions d'achat et logistique..."
              className="bg-white/5 border-white/10 rounded-3xl min-h-[120px] p-6 text-white font-bold placeholder:text-white/20 placeholder:italic italic"
            />
         </div>

         <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 italic">
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1 italic">Total Client Final (estimation)</div>
               <div className="text-3xl font-black text-white italic">$ {totalPrice.toLocaleString()}</div>
            </div>
            <Button 
               disabled={isUpdating || totalPrice <= 0}
               className="bg-secondary text-primary hover:bg-secondary/90 px-12 py-7 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-white/5"
            >
               Envoyer le devis au client <Send size={16} className="ml-2" />
            </Button>
         </div>
      </div>
    </form>
  )
}
