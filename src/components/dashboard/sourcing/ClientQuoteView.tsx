'use client'

import React from 'react'
import { 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Truck, 
  ShieldCheck, 
  ReceiptText,
  Boxes,
  Zap,
  PackageCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { acceptSourcingQuote } from '@/lib/actions/admin/sourcing/actions'
import { cn } from '@/lib/utils'

interface ClientQuoteViewProps {
  quote: any
  requestId: string
}

export function ClientQuoteView({ quote, requestId }: ClientQuoteViewProps) {
  const [isAccepting, setIsAccepting] = React.useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    const res = await acceptSourcingQuote(requestId, quote.id)
    if (res.success) {
      toast.success("Devis accepté ! Votre commande est générée ✅")
      window.location.href = `/dashboard/orders/${res.orderId}`
    } else {
      toast.error(res.error)
    }
    setIsAccepting(false)
  }

  return (
    <div className="bg-secondary p-12 md:p-16 rounded-[48px] text-primary relative overflow-hidden italic shadow-2xl shadow-secondary/10 italic tracking-tighter">
      <PackageCheck size={180} className="absolute -right-12 -bottom-12 text-primary/5 opacity-40 italic tracking-tighter" />

      <div className="relative z-10 space-y-10 italic tracking-tighter">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 italic tracking-tighter">
            <div>
               <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 italic">Devis Sharufa Officiel</div>
               <h3 className="text-3xl font-black uppercase tracking-tighter italic">Offre de Sourcing</h3>
            </div>
            <div className="text-right italic tracking-tighter">
               <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 italic tracking-tighter">Prix Total Final</div>
               <div className="text-4xl font-black italic tracking-tighter">$ {quote.totalPrice.toLocaleString('en-US')}</div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-primary/10 italic tracking-tighter">
            <div className="space-y-2 italic tracking-tighter">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic tracking-tighter">P.U Produit</p>
               <p className="text-xl font-black italic tracking-tighter">{quote.productCost.toLocaleString('en-US')} CFA</p>
            </div>
            <div className="space-y-2 italic tracking-tighter">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic tracking-tighter">Transport & Logistique</p>
               <p className="text-xl font-black italic tracking-tighter">{quote.shippingCost.toLocaleString('en-US')} CFA</p>
            </div>
            <div className="space-y-2 italic tracking-tighter">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic tracking-tighter">Frais de Service (Sharufa)</p>
               <p className="text-xl font-black italic tracking-tighter">{quote.serviceFee.toLocaleString('en-US')} CFA</p>
            </div>
         </div>

         {quote.notes && (
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 italic tracking-tighter">
               <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60 italic tracking-tighter italic">Note de l'Expert Sourcing</p>
               <p className="text-sm font-bold leading-relaxed italic tracking-tighter italic">{quote.notes}</p>
            </div>
         )}

         <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-primary/10 italic tracking-tighter">
            <div className="flex items-center gap-4 bg-white/40 px-8 py-5 rounded-full italic tracking-tighter">
               <ShieldCheck size={20} />
               <p className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Garantie Sharufa Intégrale</p>
            </div>
            <Button 
               onClick={handleAccept}
               disabled={isAccepting}
               className="bg-primary text-white hover:bg-primary/90 px-16 py-8 rounded-full font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-primary/20 italic tracking-tighter"
            >
               Accepter & Payer le Devis <ArrowRight size={18} className="ml-3" />
            </Button>
         </div>
      </div>
    </div>
  )
}
