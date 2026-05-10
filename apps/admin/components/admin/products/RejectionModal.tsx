'use client'

import React from 'react'
import { 
  XSquare, 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle2 
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  title: string
  description: string
  confirmLabel: string
}

export function RejectionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmLabel 
}: RejectionModalProps) {
  const [reason, setReason] = React.useState('')

  const handleConfirm = () => {
    if (!reason.trim()) return
    onConfirm(reason)
    setReason('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[40px] p-10 max-w-lg border-none shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="w-16 h-16 rounded-[24px] bg-red-100 flex items-center justify-center text-red-600 mb-2">
             <AlertTriangle size={32} />
          </div>
          <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tight italic">{title}</DialogTitle>
          <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed italic">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
           <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block italic flex items-center gap-2">
              <MessageSquare size={14} className="text-secondary" /> Motif du refus / Demande de correction
           </label>
           <Textarea 
             placeholder="Expliquez clairement au vendeur ce qui doit être corrigé (ex: images de mauvaise qualité, catégorie incorrecte, prix erroné...)"
             value={reason}
             onChange={(e) => setReason(e.target.value)}
             className="min-h-[120px] rounded-3xl border-primary/10 bg-slate-50 p-6 text-sm font-bold text-primary focus:ring-2 focus:ring-secondary/50 placeholder:italic transition-all outline-none"
           />
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 mt-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-full px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-slate-100 transition-all italic"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-10 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/10 transition-all italic"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
