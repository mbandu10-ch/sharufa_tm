'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogisticsStatus } from '@prisma/client'
import { updateOrderLogisticsStatus } from '@/app/dashboard/seller/orders/actions'
import { toast } from 'sonner'
import { Loader2, Send, CheckCircle2 } from 'lucide-react'

interface LogisticsActionButtonProps {
  orderId: string
  currentStatus: LogisticsStatus
}

export function LogisticsActionButton({ orderId, currentStatus }: LogisticsActionButtonProps) {
  const [loading, setLoading] = useState(false)

  let nextStatus: LogisticsStatus | null = null
  let label = ""
  let Icon = Send

  if (currentStatus === 'NEW_ORDER' || currentStatus === 'TO_PREPARE' || currentStatus === 'READY_FOR_DROPOFF') {
    nextStatus = 'DROPPED_AT_CARGO'
    label = 'Envoyé au cargo'
    Icon = Send
  } else if (currentStatus === 'REJECTED_BY_CARGO') {
    nextStatus = 'DROPPED_AT_CARGO'
    label = 'Commande corrigée'
    Icon = CheckCircle2
  }

  if (!nextStatus) return null

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!nextStatus) return
    
    setLoading(true)
    try {
      const result = await updateOrderLogisticsStatus(orderId, nextStatus)
      if (result.success) {
        toast.success(label === 'Commande corrigée' ? 'Commande corrigée et renvoyée' : 'Commande marquée comme envoyée au cargo')
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      toast.error('Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleAction} 
      disabled={loading}
      className={cn(
        "flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 shadow-lg transition-all active:scale-95 italic",
        currentStatus === 'REJECTED_BY_CARGO' ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200" : "bg-primary shadow-primary/20"
      )}
    >
      {loading ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <>
          <Icon className="mr-2" size={14} /> {label}
        </>
      )}
    </Button>
  )
}

import { cn } from '@/lib/utils'
