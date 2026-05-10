'use client'

import React from 'react'
import { 
  Plus, 
  Send, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Package, 
  Zap, 
  Boxes, 
  MapPin, 
  DollarSign, 
  Archive,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { createSourcingRequest } from '@/lib/actions/admin/sourcing/actions'
import { cn } from '@/lib/utils'

interface NewSourcingRequestFormProps {
  userId: string
}

export function NewSourcingRequestForm({ userId }: NewSourcingRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    type: 'BUY_FOR_ME',
    title: '',
    description: '',
    referenceLink: '',
    imageUrl: '',
    requestedQuantity: 1,
    targetCountry: '',
    budget: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      toast.error("Veuillez remplir les champs obligatoires ⚠️")
      return
    }

    setIsSubmitting(true)
    const res = await createSourcingRequest({
      clientId: userId,
      type: formData.type as any,
      title: formData.title,
      description: formData.description,
      referenceLink: formData.referenceLink || undefined,
      imageUrl: formData.imageUrl || undefined,
      requestedQuantity: Number(formData.requestedQuantity),
      targetCountry: formData.targetCountry || undefined,
      budget: Number(formData.budget) || undefined
    })

    if (res.success) {
      toast.success("Demande de sourcing envoyée ! ✅")
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[48px] p-10 md:p-14 border border-primary/5 shadow-2xl shadow-primary/5 space-y-12 italic tracking-tighter">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-primary/5 italic">
         <div>
            <h2 className="text-3xl font-black text-primary uppercase tracking-tighter italic">Nouveau Dossier Sourcing</h2>
            <p className="text-muted-foreground font-medium mt-1 italic tracking-widest text-[11px] uppercase">Dites-nous ce que vous cherchez, nous le trouvons pour vous.</p>
         </div>
         <div className="flex p-1.5 bg-slate-100 rounded-full italic tracking-tighter">
            <button 
               type="button"
               onClick={() => setFormData(prev => ({ ...prev, type: 'BUY_FOR_ME' }))}
               className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic",
                  formData.type === 'BUY_FOR_ME' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
               )}
            >
               Buy For Me
            </button>
            <button 
               type="button"
               onClick={() => setFormData(prev => ({ ...prev, type: 'B2B' }))}
               className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic",
                  formData.type === 'B2B' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
               )}
            >
               Sourcing B2B
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 italic">
         <div className="space-y-10 italic">
            <div className="space-y-4 italic">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Titre de la recherche *</label>
               <Input 
                 placeholder="Ex: Sneakers Edition Limitée, Machine Industrielle..."
                 value={formData.title}
                 onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                 className="bg-slate-50 border-none rounded-2xl py-7 px-8 text-sm font-black text-primary italic focus:ring-secondary/50 placeholder:text-muted-foreground/30"
               />
            </div>
            
            <div className="space-y-4 italic">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic tracking-tighter">Description détaillée du besoin *</label>
               <Textarea 
                 placeholder="Tailles, couleurs, matériaux, spécifications techniques..."
                 value={formData.description}
                 onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                 className="bg-slate-50 border-none rounded-3xl min-h-[160px] p-8 text-sm font-bold text-primary italic placeholder:text-muted-foreground/30 shadow-inner"
               />
            </div>
         </div>

         <div className="space-y-10">
            <div className="grid grid-cols-2 gap-8 italic tracking-tighter">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic tracking-tighter">Quantité</label>
                  <Input 
                    type="number"
                    value={formData.requestedQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestedQuantity: parseInt(e.target.value) }))}
                    className="bg-slate-50 border-none rounded-2xl py-7 px-8 text-sm font-black text-primary italic"
                  />
               </div>
               <div className="space-y-4 italic">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic tracking-tighter">Pays Source (Optionnel)</label>
                  <Select onValueChange={(v: string | null) => setFormData(prev => ({ ...prev, targetCountry: v ?? '' }))}>
                    <SelectTrigger className="bg-slate-50 border-none rounded-2xl h-[58px] px-8 text-sm font-black text-primary italic">
                      <SelectValue placeholder="Turquie, Chine..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Turkey">Turquie</SelectItem>
                      <SelectItem value="China">Chine</SelectItem>
                      <SelectItem value="Dubai">Dubaï</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic tracking-tighter italic">Lien de référence (ex: AliExpress, Amazon)</label>
               <div className="relative italic">
                  <Input 
                    placeholder="https://..."
                    value={formData.referenceLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, referenceLink: e.target.value }))}
                    className="bg-slate-50 border-none rounded-2xl py-7 pl-14 px-8 text-sm font-black text-primary italic focus:ring-secondary/50"
                  />
                  <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40 italic" size={16} />
               </div>
            </div>

            <div className="space-y-4 italic">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic tracking-tighter">Budget Estimé ($)</label>
               <div className="relative italic tracking-tighter">
                  <Input 
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="bg-slate-50 border-none rounded-2xl py-7 pl-14 px-8 text-sm font-black text-primary italic focus:ring-secondary/50"
                  />
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40 italic tracking-tighter" size={16} />
               </div>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-primary/5 italic">
         <div className="flex items-center gap-4 bg-secondary/5 px-8 py-4 rounded-full border border-secondary/10 italic">
            <Info size={16} className="text-secondary" />
            <p className="text-[11px] font-black uppercase tracking-widest text-primary italic tracking-tighter italic">Demande gratuite et sans engagement</p>
         </div>
         <Button 
            disabled={isSubmitting}
            className="bg-primary text-white hover:bg-primary/90 px-16 py-8 rounded-full font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-primary/20 italic tracking-tighter"
         >
            Soumettre au sourcing <Send size={16} className="ml-3" />
         </Button>
      </div>
    </form>
  )
}
