'use client'

import React from 'react'
import { 
  CheckCircle2, 
  Truck, 
  Package, 
  AlertTriangle, 
  XSquare, 
  RotateCcw, 
  CreditCard,
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { updateOrderStatus, updatePaymentStatus, addOrderInternalNote } from '@/lib/actions/admin/orders/actions'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface OrderActionsSidebarProps {
  order: any
}

export function OrderActionsSidebar({ order }: OrderActionsSidebarProps) {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [note, setNote] = React.useState(order.adminNotes || '')

  const handleUpdateStatus = async (status: string, message?: string) => {
    setIsUpdating(true)
    const res = await updateOrderStatus(order.id, status as any, message)
    if (res.success) {
      toast.success(`Statut mis à jour : ${status} ✅`)
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsUpdating(false)
  }

  const handleUpdatePayment = async (status: string) => {
    setIsUpdating(true)
    const res = await updatePaymentStatus(order.id, status as any)
    if (res.success) {
      toast.success(`Paiement mis à jour : ${status} ✅`)
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsUpdating(false)
  }

  const handleSaveNote = async () => {
    setIsUpdating(true)
    const res = await addOrderInternalNote(order.id, note)
    if (res.success) {
      toast.success("Note enregistrée ✅")
    } else {
      toast.error(res.error)
    }
    setIsUpdating(false)
  }

  return (
    <div className="space-y-10 sticky top-10">
      {/* Status Progress */}
      <div className="bg-white rounded-[40px] p-10 border border-primary/5 shadow-sm space-y-8">
         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
            <Clock size={16} className="text-secondary" /> Workflow Logistique
         </h4>

         <div className="flex flex-col gap-3">
            {order.status !== 'CONFIRMED' && order.status === 'NEW' && (
              <Button 
                onClick={() => handleUpdateStatus('CONFIRMED')}
                disabled={isUpdating}
                className="w-full bg-secondary hover:bg-secondary/90 text-primary rounded-full py-7 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-secondary/10"
              >
                Confirmer la commande <CheckCircle2 size={16} className="ml-2" />
              </Button>
            )}

            {order.status === 'CONFIRMED' && (
              <Button 
                onClick={() => handleUpdateStatus('PROCESSING')}
                disabled={isUpdating}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-7 font-black uppercase text-[10px] tracking-widest"
              >
                Lancer le traitement <Package size={16} className="ml-2" />
              </Button>
            )}

            {(order.status === 'PROCESSING' || order.status === 'CONFIRMED') && (
              <Button 
                onClick={() => handleUpdateStatus('READY_TO_SHIP')}
                disabled={isUpdating}
                className="w-full bg-white border-2 border-primary/5 text-primary hover:bg-primary/5 rounded-full py-7 font-black uppercase text-[10px] tracking-widest"
              >
                Prête à expédier <Truck size={16} className="ml-2" />
              </Button>
            )}

            {order.status === 'READY_TO_SHIP' && (
              <Button 
                onClick={() => handleUpdateStatus('SHIPPED')}
                disabled={isUpdating}
                className="w-full bg-primary text-white hover:bg-primary/90 rounded-full py-7 font-black uppercase text-[10px] tracking-widest"
              >
                Marquer comme expédiée <ArrowRight size={16} className="ml-2" />
              </Button>
            )}

            {order.status === 'SHIPPED' && (
              <Button 
                onClick={() => handleUpdateStatus('DELIVERED')}
                disabled={isUpdating}
                className="w-full bg-green-600 text-white hover:bg-green-700 rounded-full py-7 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-600/10"
              >
                Confirmer la livraison <CheckCircle2 size={16} className="ml-2" />
              </Button>
            )}

            <Button 
               variant="outline"
               onClick={() => handleUpdateStatus('ISSUE', "Signalement d'un incident logistique.")}
               disabled={isUpdating}
               className="w-full rounded-full py-7 border-red-100 text-red-500 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest mt-4 italic"
            >
               Signaler un problème <AlertTriangle size={16} className="ml-2" />
            </Button>
         </div>
      </div>

      {/* Payment Control */}
      <div className="bg-slate-50/50 rounded-[40px] p-10 border border-primary/5 space-y-8">
         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
            <CreditCard size={16} className="text-secondary" /> Gestion du Paiement
         </h4>
         
         <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Statut actuel</span>
            <Badge variant="outline" className={cn(
              "rounded-full font-black uppercase text-[10px] tracking-widest py-1 px-4 border-none shadow-sm",
              order.paymentStatus === 'PAID' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
            )}>
               {order.paymentStatus}
            </Badge>
         </div>

         <div className="flex gap-2">
            {order.paymentStatus !== 'PAID' && (
              <Button 
                variant="outline"
                onClick={() => handleUpdatePayment('PAID')}
                disabled={isUpdating}
                className="flex-grow rounded-full text-[9px] font-black uppercase tracking-widest border-green-200 text-green-600 hover:bg-green-50"
              >
                Valider Paiement
              </Button>
            )}
            <Button 
               variant="outline"
               onClick={() => handleUpdatePayment('REFUNDED')}
               disabled={isUpdating}
               className="flex-grow rounded-full text-[9px] font-black uppercase tracking-widest border-red-200 text-red-400 hover:bg-red-50"
            >
               Rembourser
            </Button>
         </div>
      </div>

      {/* Internal Notes */}
      <div className="bg-white rounded-[40px] p-10 border border-primary/5 shadow-sm space-y-6">
         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
            <MessageSquare size={16} className="text-secondary" /> Notes Internes Admin
         </h4>
         <Textarea 
           placeholder="Notes administratives, suivi transporteur, commentaires privés..."
           value={note}
           onChange={(e) => setNote(e.target.value)}
           className="min-h-[120px] rounded-3xl border-primary/10 bg-slate-50 p-6 text-sm font-bold text-primary focus:ring-2 focus:ring-secondary/50 placeholder:italic transition-all outline-none"
         />
         <Button 
            onClick={handleSaveNote}
            disabled={isUpdating || note === order.adminNotes}
            className="w-full bg-primary text-white rounded-full py-6 font-black uppercase text-[10px] tracking-widest"
         >
            Enregistrer la note
         </Button>
      </div>

      {/* Danger Zone */}
      <div className="pt-4 px-10">
         <Button 
            variant="ghost" 
            onClick={() => handleUpdateStatus('CANCELLED', "Annulation par l'administrateur.")}
            className="w-full text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-[0.2em] italic"
         >
            <XSquare size={14} className="mr-2" /> Annuler la commande
         </Button>
      </div>
    </div>
  )
}
