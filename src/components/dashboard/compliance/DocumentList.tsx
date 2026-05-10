'use client'

import React, { useState } from 'react'
import { uploadShopDocument } from '@/app/seller/compliance-actions'
import { toast } from 'sonner'
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { ShopDocumentType, ShopDocumentStatus } from '@prisma/client'

interface DocumentListProps {
  shopId: string
  documents: any[]
}

const DOCUMENT_TYPES: { type: ShopDocumentType; label: string; description: string }[] = [
  { 
    type: 'TRADE_LICENSE', 
    label: 'Licence Commerciale', 
    description: 'Document officiel de votre entreprise.' 
  },
  { 
    type: 'RIB', 
    label: 'Coordonnées Bancaires (RIB)', 
    description: 'Document confirmant votre IBAN et SWIFT.' 
  },
  { 
    type: 'VAT_CERTIFICATE', 
    label: 'Certificat TVA (Optionnel)', 
    description: 'Preuve d\'immatriculation fiscale.' 
  },
  { 
    type: 'NATIONAL_ID', 
    label: 'Pièce d\'Identité (Gérant)', 
    description: 'CNI ou Passeport en cours de validité.' 
  }
]

export function DocumentList({ shopId, documents }: DocumentListProps) {
  const [uploadingType, setUploadingType] = useState<ShopDocumentType | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: ShopDocumentType) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop lourd (max 5MB).')
      return
    }

    setUploadingType(type)
    const formData = new FormData()
    formData.append('shopId', shopId)
    formData.append('type', type)
    formData.append('file', file)
    
    // Si c'est une licence, on pourrait demander la date d'expiration
    // Pour le MVP, on ignore expiresAt ici ou on pourrait ajouter un champ simple

    const result = await uploadShopDocument(formData)
    setUploadingType(null)

    if (result.success) {
      toast.success(`Document ${type} envoyé avec succès.`)
    } else {
      toast.error(result.error || 'Erreur lors de l\'envoi.')
    }
  }

  const getDocByStatus = (type: ShopDocumentType) => {
    return documents.find(doc => doc.type === type)
  }

  const getStatusIcon = (status?: ShopDocumentStatus) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle2 className="text-green-500 w-5 h-5" />
      case 'REJECTED': return <XCircle className="text-red-500 w-5 h-5" />
      case 'PENDING': return <Clock className="text-blue-500 w-5 h-5" />
      default: return <Clock size={20} className="text-slate-300" />
    }
  }

  return (
    <div className="space-y-4">
      {DOCUMENT_TYPES.map((docType) => {
        const existingDoc = getDocByStatus(docType.type)
        const isUploading = uploadingType === docType.type

        return (
          <div 
            key={docType.type} 
            className="group p-5 rounded-2xl border border-slate-100 bg-slate-50/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                existingDoc ? 'bg-primary/5 text-primary' : 'bg-slate-100 text-slate-400'
              }`}>
                <FileText size={24} />
              </div>
              <div className="space-y-0.5">
                 <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                   {docType.label}
                   {getStatusIcon(existingDoc?.verificationStatus)}
                 </h4>
                 <p className="text-[11px] text-slate-500 font-medium">{docType.description}</p>
                 
                 {existingDoc && (
                   <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                      Envoyé le {new Date(existingDoc.uploadedAt).toLocaleDateString('fr-FR')}
                      <ChevronRight size={10} />
                      <a 
                        href={existingDoc.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="underline hover:text-blue-800 flex items-center gap-1"
                      >
                        Voir le fichier <ExternalLink size={10} />
                      </a>
                   </div>
                 )}
              </div>
            </div>

             <div className="flex items-center">
                <label className={`cursor-pointer px-6 py-3 rounded-xl border-2 font-black text-[11px] uppercase tracking-[0.1em] transition-all flex items-center gap-2 shadow-sm ${
                  existingDoc 
                  ? 'border-slate-100 bg-white text-primary hover:border-primary/20 hover:shadow-md' 
                  : 'border-secondary bg-secondary text-primary shadow-lg shadow-secondary/10 hover:scale-105 active:scale-95 hover:bg-white hover:text-primary'
                } ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                   {isUploading ? 'Transfert...' : (
                     <>
                       {existingDoc ? 'Modifier' : 'Uploader'} <Upload size={14} />
                     </>
                   )}
                   <input 
                     type="file" 
                     className="hidden" 
                     onChange={(e) => handleUpload(e, docType.type)}
                     disabled={isUploading}
                     accept=".pdf,.jpg,.jpeg,.png"
                   />
                </label>
             </div>
          </div>
        )
      })}
    </div>
  )
}
