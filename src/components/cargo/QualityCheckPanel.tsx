'use client'

import React, { useState } from 'react'
import { QualityCheckStatus } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Camera, CheckCircle2, XCircle, Loader2, Info, ShieldCheck, Trash2 } from 'lucide-react'
import { submitQualityCheck, uploadQualityCheckMediaFiles } from '@/app/cargo/orders/actions'

interface QualityCheckPanelProps {
  orderId: string
  existingCheck?: {
    status: QualityCheckStatus
    notes: string | null
    media: { fileUrl: string; type: string }[]
  } | null
}

export default function QualityCheckPanel({ orderId, existingCheck }: QualityCheckPanelProps) {
  const [notes, setNotes] = useState(existingCheck?.notes || "")
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>(existingCheck?.media.map(m => m.fileUrl) || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      
      if (files.length + selectedFiles.length > 3) {
        toast.error('Maximum 3 médias autorisés.')
        return
      }

      setFiles(prev => [...prev, ...selectedFiles])
      
      const newPreviews = selectedFiles.map(f => URL.createObjectURL(f))
      setPreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    // We only allow removing newly added files for simplicity, or we can just reset if mixing.
    // If we have existing media from DB, and they add more, it might get tricky.
    // Let's assume if existingCheck exists, the panel is READ-ONLY, or if they update, they override.
    setPreviews(prev => prev.filter((_, i) => i !== index))
    
    // Adjust files array (offset by existing if needed, but here we just clear all for simplicity if it gets messy)
    if (index >= (existingCheck?.media.length || 0)) {
        const fileIndex = index - (existingCheck?.media.length || 0)
        setFiles(prev => prev.filter((_, i) => i !== fileIndex))
    }
  }

  const submitCheck = async (status: QualityCheckStatus) => {
    if (status === 'FAILED' && !notes.trim()) {
      toast.error("Veuillez expliquer la raison du rejet dans les notes.")
      return
    }

    if (status === 'FAILED' && files.length === 0 && (!existingCheck || existingCheck.media.length === 0)) {
      toast.error("Veuillez fournir au moins une photo comme preuve du défaut.")
      return
    }

    setIsSubmitting(true)

    try {
      let mediaUrls: { url: string, type: string }[] = existingCheck?.media.map(m => ({ url: m.fileUrl, type: m.type })) || []

      // Upload new files if any
      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((f, i) => formData.append(`media[${i}]`, f))
        
        const uploadResult = await uploadQualityCheckMediaFiles(formData)
        if (uploadResult.error) {
          toast.error(uploadResult.error)
          setIsSubmitting(false)
          return
        }
        
        if (uploadResult.urls) {
          // If updating, we replace or append. Let's append for now.
          mediaUrls = [...mediaUrls, ...uploadResult.urls]
        }
      }

      const result = await submitQualityCheck({
        orderId,
        status,
        notes,
        mediaUrls
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Contrôle qualité ${status === 'APPROVED' ? 'approuvé' : 'rejeté'} avec succès.`)
      }
    } catch (e) {
      toast.error("Une erreur inconnue s'est produite.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isApproved = existingCheck?.status === 'APPROVED'
  const isFailed = existingCheck?.status === 'FAILED'

  if (isApproved) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-green-900 text-lg">Contrôle Qualité Validé</h3>
          <p className="text-green-700/80 text-sm">Le colis avec la référence a été inspecté et est conforme. Prêt pour l'expédition.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-3xl border-2 p-6 mb-8 shadow-sm transition-all ${isFailed ? 'border-destructive/30 bg-destructive/5' : 'border-secondary/20 bg-secondary/5'}`}>
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className={isFailed ? "text-destructive w-6 h-6" : "text-secondary w-6 h-6"} />
        <h2 className="text-xl font-bold font-outfit text-primary">
          {isFailed ? "Inspection Qualité : Échouée" : "Inspection Qualité (Requise)"}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Photos de l'inspection</Label>
          <div className="flex flex-wrap gap-4">
            {previews.map((prev, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-2xl border-2 border-border overflow-hidden">
                <img src={prev} alt="Preuve" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-destructive"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            
            {previews.length < 3 && (
              <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-border hover:border-secondary transition-all flex flex-col items-center justify-center cursor-pointer group">
                <Camera className="text-muted-foreground group-hover:text-secondary mb-1" size={20} />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Ajouter</span>
                <input type="file" className="hidden" accept="image/*,video/*" multiple onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Notes de l'inspecteur</Label>
          <Textarea 
            placeholder={isFailed ? "Expliquez précisément pourquoi le contrôle a échoué (ex: couleur erronée, objet cassé)..." : "Notes éventuelles..."}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-2xl border-2 bg-white/50 min-h-[100px]"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
           <Button 
             onClick={() => submitCheck('APPROVED')}
             disabled={isSubmitting}
             className="flex-1 rounded-2xl h-14 bg-green-600 hover:bg-green-700 text-white font-bold tracking-wide"
           >
             {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
             Approuver le Colis
           </Button>

           <Button 
             onClick={() => submitCheck('FAILED')}
             disabled={isSubmitting}
             variant="destructive"
             className="flex-1 rounded-2xl h-14 font-bold tracking-wide"
           >
             {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <XCircle className="mr-2" />}
             Rejeter (Non Conforme)
           </Button>
        </div>
      </div>
    </div>
  )
}
