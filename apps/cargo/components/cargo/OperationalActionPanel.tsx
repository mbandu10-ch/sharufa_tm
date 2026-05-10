'use client'

import React, { useState } from 'react'
import { LogisticsStatus, OrderStatus, TransportType } from '@prisma/client'
import { updateOrderLogisticsStatusByCargo, uploadLogisticsProof } from '@/lib/actions/cargo/actions'
import { toast } from 'sonner'
import { Button } from '@sharufa/ui/components/button'
import { Input } from '@sharufa/ui/components/input'
import { Textarea } from '@sharufa/ui/components/textarea'
import { 
  Truck, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation,
  CheckCircle,
  Clock,
  Box,
  Plane,
  Ship,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogisticsProofUploader } from './LogisticsProofUploader'

interface OperationalActionPanelProps {
  orderId: string
  currentStatus: LogisticsStatus
  globalStatus: OrderStatus
  qcApproved?: boolean
  qcRequired?: boolean
  originCity?: string
  cargoTransportType: TransportType
  availableBatches?: { id: string, batchNumber: string }[]
}

export function OperationalActionPanel({ 
  orderId, 
  currentStatus, 
  originCity,
  cargoTransportType,
  availableBatches = []
}: OperationalActionPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState(originCity || "")
  const [note, setNote] = useState("")
  const [proofFiles, setProofFiles] = useState<File[]>([])
  const [batchId, setBatchId] = useState("")

  const handleAction = async (nextStatus: LogisticsStatus) => {
    if (!location) {
      toast.error("Veuillez indiquer la localisation actuelle.")
      return
    }

    const requiresProof = ['RECEIVED_BY_CARGO', 'REJECTED_BY_CARGO', 'SHIPPED', 'DELIVERED'].includes(nextStatus)
    
    if (requiresProof) {
      if (proofFiles.length === 0) {
        toast.error("Des photos de preuve sont obligatoires pour ce statut.")
        return
      }
      if (!note) {
        toast.error("Une note explicative est obligatoire pour ce statut.")
        return
      }
    }

    if (nextStatus === 'SHIPPED' && cargoTransportType === 'SEA' && !batchId) {
      toast.error("Veuillez sélectionner un lot (Batch) pour l'expédition maritime.")
      return
    }

    setIsSubmitting(true)
    try {
      let mediaUrls: string[] = []
      
      // 1. Upload proofs if any
      if (proofFiles.length > 0) {
        const formData = new FormData()
        proofFiles.forEach((file, i) => formData.append(`files[${i}]`, file))
        const uploadRes = await uploadLogisticsProof(formData, orderId, nextStatus)
        if (uploadRes.error) throw new Error(uploadRes.error)
        mediaUrls = uploadRes.urls || []
      }

      // 2. Submit status change
      const res = await updateOrderLogisticsStatusByCargo({
        orderId,
        nextStatus,
        location,
        note,
        mediaUrls,
        batchId: batchId || undefined
      })

      if (res.success) {
        toast.success("Mise à jour logistique validée ✅")
        setNote("")
        setProofFiles([])
        setBatchId("")
      } else {
        throw new Error(res.error || "Une erreur est survenue")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Define actions
  let actions: { label: string, status: LogisticsStatus, icon: any, color: string }[] = []
  let message: string | null = null

  if (currentStatus === 'DROPPED_AT_CARGO') {
    actions = [
      { label: "Réceptionner la commande", status: 'RECEIVED_BY_CARGO', icon: CheckCircle2, color: "bg-emerald-600" },
      { label: "Retour non-conformité", status: 'REJECTED_BY_CARGO', icon: AlertTriangle, color: "bg-rose-600" }
    ]
  } else if (currentStatus === 'RECEIVED_BY_CARGO') {
    actions = [{ label: "Marquer comme Expédié", status: 'SHIPPED', icon: Truck, color: "bg-indigo-600" }]
  } else if (currentStatus === 'SHIPPED') {
    actions = [{ label: "Marquer en Transit", status: 'IN_TRANSIT', icon: Navigation, color: "bg-blue-600" }]
  } else if (currentStatus === 'IN_TRANSIT') {
    actions = [{ label: "Arrivé Destination", status: 'READY_FOR_DELIVERY', icon: MapPin, color: "bg-amber-600" }]
  } else if (currentStatus === 'READY_FOR_DELIVERY') {
    actions = [{ label: "Confirmer Livraison", status: 'DELIVERED', icon: CheckCircle2, color: "bg-green-600" }]
  } else if (currentStatus === 'DELIVERED') {
    message = "Commande terminée et livrée."
  } else if (currentStatus === 'REJECTED_BY_CARGO') {
    message = "Commande retournée au vendeur (non-conforme)."
  }

  const isShippingSea = currentStatus === 'RECEIVED_BY_CARGO' && cargoTransportType === 'SEA'

  return (
    <div className="space-y-8 italic">
      <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <MapPin size={14} className="text-secondary" /> Localisation actuelle
                </label>
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Hub Istanbul, Port Dakar..."
                  className="rounded-2xl border-2 border-white h-14 font-bold text-sm italic bg-white px-6 focus:ring-secondary/50 shadow-sm"
                />
              </div>

              {isShippingSea && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Ship size={14} className="text-secondary" /> Assigner à un Lot (Batch)
                  </label>
                  <select
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="w-full rounded-2xl border-2 border-white h-14 font-bold text-sm italic bg-white px-6 outline-none focus:ring-secondary/50 shadow-sm"
                  >
                    <option value="">Sélectionner un lot...</option>
                    {availableBatches.map(b => (
                      <option key={b.id} value={b.id}>Lot #{b.batchNumber}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">Note explicative (obligatoire pour preuve)</label>
              <Textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Détails sur l'état, conformité, observations..."
                className="rounded-[24px] border-2 border-white min-h-[100px] p-6 font-bold text-sm italic bg-white focus:ring-secondary/50 shadow-sm"
              />
            </div>

            <LogisticsProofUploader 
              files={proofFiles}
              onFilesChange={setProofFiles}
            />
          </div>

          <div className="lg:w-80 flex flex-col gap-4 shrink-0">
             <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  cargoTransportType === 'AIR' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {cargoTransportType === 'AIR' ? <Plane size={20} /> : <Ship size={20} />}
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Mode de transport</p>
                   <p className="text-sm font-black text-primary uppercase">{cargoTransportType === 'AIR' ? 'Fret Aérien' : 'Fret Maritime'}</p>
                </div>
             </div>

             {actions.length > 0 ? (
               actions.map((action) => (
                 <Button 
                   key={action.status}
                   onClick={() => handleAction(action.status)}
                   disabled={isSubmitting}
                   className={cn(
                     "w-full h-32 rounded-[32px] flex flex-col items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl text-white border-none",
                     action.color
                   )}
                 >
                   {isSubmitting ? (
                     <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="text-[10px] font-black uppercase">Validation...</span>
                     </div>
                   ) : (
                     <>
                       <action.icon size={32} />
                       <span className="font-black uppercase text-xs tracking-widest text-center px-4 leading-tight">{action.label}</span>
                     </>
                   )}
                 </Button>
               ))
             ) : (
               <div className="w-full h-32 rounded-[32px] bg-slate-200 flex flex-col items-center justify-center gap-2 text-slate-500 border-2 border-dashed border-slate-300">
                  <Clock size={32} opacity={0.5} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center px-6">
                    {message || "En attente du vendeur"}
                  </span>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between px-4 overflow-x-auto pb-4 gap-4 scrollbar-hide">
         {[
           { s: 'RECEIVED_BY_CARGO', l: 'Reçu' },
           { s: 'SHIPPED', l: 'Expédié' },
           { s: 'IN_TRANSIT', l: 'En Transit' },
           { s: 'READY_FOR_DELIVERY', l: 'Prêt' },
           { s: 'DELIVERED', l: 'Livré' }
         ].map((step, idx) => {
           const steps = ['RECEIVED_BY_CARGO', 'SHIPPED', 'IN_TRANSIT', 'READY_FOR_DELIVERY', 'DELIVERED']
           const currentIdx = steps.indexOf(currentStatus)
           const isDone = currentIdx >= idx
           
           return (
             <React.Fragment key={step.s}>
               <div className="flex flex-col items-center gap-2 min-w-fit">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isDone ? "bg-secondary border-secondary text-primary" : "border-slate-200 text-slate-300"
                  )}>
                    {isDone ? <CheckCircle size={18} /> : <span className="text-xs font-black">{idx + 1}</span>}
                  </div>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    isDone ? "text-primary" : "text-slate-400"
                  )}>{step.l}</span>
               </div>
               {idx < 4 && <div className={cn("h-px w-full min-w-[20px]", isDone ? "bg-secondary" : "bg-slate-100")} />}
             </React.Fragment>
           )
         })}
      </div>
    </div>
  )
}
