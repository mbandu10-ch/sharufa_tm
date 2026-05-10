'use client'

import React from 'react'
import { 
  Package, 
  Store, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  XSquare, 
  AlertTriangle,
  Clock,
  ExternalLink,
  History,
  TrendingUp,
  Archive,
  Info,
  Calendar,
  Layers,
  Search,
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import Link from 'next/link'
import { updateProductStatus, updateProductDetails } from '@/lib/actions/admin/products/actions'
import { AuditLogList } from '@/components/admin/compliance/AuditLogList'
import { RejectionModal } from './RejectionModal'

interface AdminProductDetailProps {
  product: any
  events: any[]
}

export function AdminProductDetail({ product, events }: AdminProductDetailProps) {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [modalConfig, setModalConfig] = React.useState<{
    isOpen: boolean
    status: 'REJECTED' | 'NEEDS_CORRECTION'
    title: string
    description: string
    confirmLabel: string
  }>({
    isOpen: false,
    status: 'REJECTED',
    title: '',
    description: '',
    confirmLabel: ''
  })

  const handleUpdateStatus = async (status: string, reason?: string) => {
    setIsUpdating(true)
    const res = await updateProductStatus(product.id, status as any, reason)
    if (res.success) {
      toast.success(`Opération réussie ✅`)
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsUpdating(false)
    setModalConfig(prev => ({ ...prev, isOpen: false }))
  }

  const openRejectionModal = () => {
    setModalConfig({
      isOpen: true,
      status: 'REJECTED',
      title: 'Rejeter le Produit',
      description: 'Cette action bloquera la publication du produit. Veuillez justifier cette décision.',
      confirmLabel: 'Confirmer le Rejet'
    })
  }

  const openCorrectionModal = () => {
    setModalConfig({
      isOpen: true,
      status: 'NEEDS_CORRECTION',
      title: 'Demander une Correction',
      description: 'Le produit sera renvoyé au vendeur pour modification. Précisez les éléments à corriger.',
      confirmLabel: 'Envoyer la Demande'
    })
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header / Primary Info */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
           <div className="w-48 h-48 rounded-[48px] bg-muted overflow-hidden border-4 border-slate-50 shadow-xl group">
              <img src={product.images[0] || 'https://via.placeholder.com/150'} alt="logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
           </div>
           <div>
              <div className="flex items-center gap-4 mb-3">
                 <h1 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-tight leading-none">{product.name}</h1>
                 <Badge className={cn(
                    "border-none px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest",
                    product.status === 'APPROVED' ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                 )}>
                    {product.status}
                 </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground font-bold uppercase tracking-widest italic">
                 <div className="flex items-center gap-2 text-secondary"><Store size={18} /> {product.shop?.name || 'Inconnu'}</div>
                 <div className="flex items-center gap-2"><Layers size={18} /> {product.category.name}</div>
                 <div className="flex items-center gap-2"><MapPin size={18} /> {product.originCountry?.name || 'N/A'}</div>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
           {product.status !== 'APPROVED' && (
              <Button 
                onClick={() => handleUpdateStatus('APPROVED')}
                disabled={isUpdating}
                className="bg-secondary hover:bg-secondary/90 text-primary rounded-full px-10 py-7 h-auto font-black uppercase text-[10px] tracking-widest shadow-xl shadow-secondary/10"
              >
                <CheckCircle2 size={18} className="mr-2" /> Approuver le produit
              </Button>
           )}
           
           <Button 
             variant="outline"
             onClick={openCorrectionModal}
             disabled={isUpdating}
             className="rounded-full px-8 py-7 h-auto border-2 border-amber-200 text-amber-600 hover:bg-amber-50 font-black uppercase text-[10px] tracking-widest italic"
           >
             <AlertTriangle size={18} className="mr-2" /> Demander Correction
           </Button>

           <Button 
             variant="outline" 
             onClick={openRejectionModal}
             disabled={isUpdating}
             className="rounded-full px-8 py-7 h-auto border-2 border-red-200 text-red-500 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest italic"
           >
             <XSquare size={18} className="mr-2" /> Rejeter / Bloquer
           </Button>
        </div>
      </div>

      <RejectionModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={(reason) => handleUpdateStatus(modalConfig.status, reason)}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmLabel={modalConfig.confirmLabel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Section Galerie Images */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
                 <div className="flex items-center gap-3">
                    <Archive className="text-secondary" size={20} />
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">Gestion des Visuels</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-10">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {product.images.map((img: string, i: number) => (
                      <div key={i} className="aspect-square rounded-3xl bg-slate-50 overflow-hidden border border-slate-100 group cursor-zoom-in relative">
                         <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                         <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Search size={24} />
                         </div>
                      </div>
                    ))}
                    {product.images.length === 0 && (
                      <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                         <AlertTriangle size={32} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Aucun visuel soumis</p>
                      </div>
                    )}
                 </div>
              </CardContent>
           </Card>

           {/* Section Attributs et Spécifications */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
                 <div className="flex items-center gap-3">
                    <Tag className="text-secondary" size={20} />
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">Spécifications Techniques (Attributs)</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Description Produit</p>
                          <p className="text-sm font-medium text-primary leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
                            {product.description || 'Aucune description disponible.'}
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Prix Unitaire</p>
                             <p className="text-xl font-black text-primary uppercase">{product.price.toLocaleString()} CFA</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Stock Dispo</p>
                             <p className="text-xl font-black text-primary uppercase">{product.stock} unités</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">MOQ (Minimum)</p>
                             <p className="text-xl font-black text-secondary uppercase italic">{product.minOrderQuantity} pièce(s)</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Référence SKU</p>
                             <p className="text-xl font-black text-primary uppercase opacity-60 tracking-tighter italic">#{product.reference || 'N/A'}</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50/50 p-10 rounded-[40px] border border-slate-100 h-full">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                          <Info size={14} className="text-secondary" /> Attributs Dynamiques
                       </h4>
                       <div className="space-y-6">
                          {product.attributes ? Object.entries(product.attributes as any).map(([key, value]: any) => (
                            <div key={key} className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-none">
                               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{key.replace(/_/g, ' ')}</span>
                               <span className="text-xs font-black text-primary uppercase italic text-right">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                            </div>
                          )) : (
                            <div className="py-10 text-center opacity-40">
                               <p className="text-[10px] font-black uppercase tracking-widest">Aucun attribut spécifique</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Sidebar Actions & Audit */}
        <div className="space-y-10">
           {/* Section Audit Log Produit */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardContent className="p-10">
                 {/* Reusing AuditLogList with mapping to ProductEvents if needed */}
                 <AuditLogList events={events.map(e => ({
                    ...e,
                    eventType: e.eventType,
                    message: e.message
                 }))} />
              </CardContent>
           </Card>

           {/* Quick Stats Sidebar */}
           <Card className="rounded-[40px] border-none shadow-xl overflow-hidden bg-primary text-white p-10 relative group">
              <TrendingUp size={120} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xs font-black uppercase tracking-widest mb-6 block text-secondary">Aperçu Performance</CardTitle>
              <div className="space-y-6 relative z-10">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 italic tracking-tighter">Ventes totales</p>
                    <p className="text-3xl font-black italic">0 FCFA</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 italic tracking-tighter">Commandes</p>
                    <p className="text-3xl font-black italic">0</p>
                 </div>
                 <div className="pt-6 border-t border-white/5">
                    <Link href={`/seller/shop/${product.shopId}`} className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
                       Voir Boutique Vendeur <ArrowRight size={14} />
                    </Link>
                 </div>
              </div>
           </Card>

           {/* Notes Administratives */}
           <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-4 italic">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                 <Info size={14} className="text-secondary" /> Notes Admin Internes
              </h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                 {product.adminNotes || "Aucune note administrative pour le moment. Utilisez le module de correction pour ajouter des précisions techniques."}
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
