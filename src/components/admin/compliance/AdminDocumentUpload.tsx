'use client'

import React from 'react'
import { Upload, FileText, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { adminUploadDocument } from '@/app/seller/admin-actions'
import { ShopDocumentType } from '@prisma/client'
import { toast } from 'sonner'

interface AdminDocumentUploadProps {
  shopId: string
}

export function AdminDocumentUpload({ shopId }: AdminDocumentUploadProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [docType, setDocType] = React.useState<ShopDocumentType>('TRADE_LICENSE')
  const [file, setFile] = React.useState<File | null>(null)

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('shopId', shopId)
    formData.append('type', docType)
    formData.append('file', file)

    const res = await adminUploadDocument(formData)
    
    if (res.success) {
      toast.success('Document ajouté avec succès !')
      setIsOpen(false)
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsUploading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={(props) => (
          <Button {...props} className="bg-primary text-white rounded-full px-6 py-2 shadow-lg shadow-primary/10 font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
            <Upload size={14} className="mr-2" /> Ajouter un Document
          </Button>
        )}
      />
      <DialogContent className="rounded-[40px] border-none p-10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-primary">Ajout Manuel de Document</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium py-2">
            Uploadez une pièce fournie par le vendeur. Le document sera marqué comme <strong>VÉRIFIÉ</strong> automatiquement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type de Document</label>
             <Select value={docType} onValueChange={(v: any) => setDocType(v)}>
                <SelectTrigger className="rounded-2xl h-14 border-slate-100 font-bold profile-input-shadow">
                   <SelectValue placeholder="Choisir un type..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                   <SelectItem value="TRADE_LICENSE" className="font-bold">Registre du Commerce / License</SelectItem>
                   <SelectItem value="RIB" className="font-bold">RIB / Coordonnées Bancaires</SelectItem>
                   <SelectItem value="VAT_CERTIFICATE" className="font-bold">Certificat TVA</SelectItem>
                   <SelectItem value="NATIONAL_ID" className="font-bold">Pièce d'Identité (CNI)</SelectItem>
                   <SelectItem value="PASSPORT" className="font-bold">Passeport</SelectItem>
                   <SelectItem value="OTHER" className="font-bold">Autre document</SelectItem>
                </SelectContent>
             </Select>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fichier</label>
             <div className="relative group">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={cn(
                  "border-2 border-dashed rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 transition-all group-hover:border-primary/20",
                  file ? "border-secondary bg-secondary/5" : "border-slate-100 bg-slate-50/50"
                )}>
                   {file ? (
                     <>
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-lg">
                           <Check size={24} />
                        </div>
                        <p className="text-xs font-black text-primary truncate max-w-[200px]">{file.name}</p>
                     </>
                   ) : (
                     <>
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-muted-foreground shadow-sm group-hover:scale-110 transition-transform">
                           <FileText size={24} />
                        </div>
                        <p className="text-xs font-bold text-muted-foreground">Cliquez ou glissez le fichier ici</p>
                     </>
                   )}
                </div>
             </div>
          </div>

          <Button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full bg-primary text-white rounded-full py-8 font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <>
                 <Loader2 size={18} className="mr-2 animate-spin" /> Upload en cours...
              </>
            ) : (
              "Finaliser l'ajout"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
