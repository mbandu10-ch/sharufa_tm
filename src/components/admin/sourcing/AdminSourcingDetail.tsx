'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
  Store, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  Truck, 
  CreditCard,
  Info,
  Calendar,
  Layers,
  Search,
  ChevronRight,
  ArrowRight,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  History,
  ExternalLink,
  Archive,
  Zap,
  Boxes,
  MessageSquare
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteForm } from './QuoteForm'
import { AuditLogList } from '@/components/admin/compliance/AuditLogList'
import { updateSourcingStatus } from '@/lib/actions/admin/sourcing/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AdminSourcingDetailProps {
  request: any
  events: any[]
  quotes: any[]
}

export function AdminSourcingDetail({ request, events, quotes }: AdminSourcingDetailProps) {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const activeQuote = quotes.find(q => q.isActive)

  const handleUpdateStatus = async (status: string) => {
    setIsUpdating(true)
    const res = await updateSourcingStatus(request.id, status as any)
    if (res.success) {
      toast.success(`Statut mis à jour : ${status} ✅`)
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsUpdating(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
      <div className="lg:col-span-2 space-y-10">
         {/* Detail Header Banner */}
         <div className="bg-white rounded-[40px] p-10 border border-primary/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden italic shadow-xl shadow-primary/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/10 transition-transform hover:scale-105">
                  {request.type === 'B2B' ? <Boxes size={32} /> : <Zap size={32} />}
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 italic">Dossier Sourcing #{request.id.slice(0, 8)}</div>
                  <h1 className="text-3xl font-black text-primary uppercase tracking-tighter leading-none italic">{request.title || 'Demande Sourcing'}</h1>
               </div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
               <Badge className={cn(
                  "px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest border-none shadow-lg italic",
                  request.status === 'COMPLETED' ? "bg-green-100 text-green-700 shadow-green-100/30" : "bg-secondary text-primary shadow-secondary/20"
               )}>
                  {request.status}
               </Badge>
            </div>
         </div>

         {/* Request Details Card */}
         <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
               <div className="flex items-center gap-3">
                  <Archive className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Expression du besoin client</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-10 italic">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 italic">Description du besoin</p>
                        <p className="text-sm font-bold text-primary leading-relaxed bg-slate-50 p-8 rounded-3xl border border-slate-100 italic shadow-inner">
                          {request.description}
                        </p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">Budget Estimé</p>
                           <p className="text-sm font-black text-primary italic">$ {request.budget?.toLocaleString() || '---'}</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic italic">Quantité Souhaitée</p>
                           <p className="text-sm font-black text-secondary italic">{request.requestedQuantity} unité(s)</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">Pays Ciblé</p>
                           <div className="text-sm font-black text-primary flex items-center gap-2 italic uppercase">
                              <MapPin size={12} className="text-secondary" /> {request.targetCountry || 'Tous Pays'}
                           </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">Réf. Externe</p>
                           {request.referenceLink ? (
                             <a href={request.referenceLink} target="_blank" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 italic truncate">
                                Voir le lien <ExternalLink size={10} />
                             </a>
                           ) : <span className="text-xs font-black opacity-30">N/A</span>}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 italic tracking-tighter">Visuel de référence</p>
                        <div className="aspect-square rounded-[40px] bg-slate-100 overflow-hidden border border-slate-200 group relative">
                           {request.imageUrl ? (
                             <img src={request.imageUrl} alt="sourcing" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                           ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                <Archive size={48} className="opacity-40 mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic tracking-tighter">Aucune image fournie</span>
                             </div>
                           )}
                           <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Search size={24} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Quote Editor Section */}
         <QuoteForm requestId={request.id} currentQuote={activeQuote} />

         {/* Timeline / Audit Log */}
         <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
               <div className="flex items-center gap-3">
                  <History className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Timeline du dossier Sourcing</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-10 italic">
               <AuditLogList events={events.map(e => ({ ...e, eventType: e.action }))} />
            </CardContent>
         </Card>
      </div>

      <div className="space-y-10">
         {/* Admin Action Control */}
         <div className="bg-white rounded-[40px] p-10 border border-primary/5 shadow-sm space-y-8 italic shadow-xl shadow-primary/5 italic tracking-tighter">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
               <ShieldCheck size={16} className="text-secondary" /> Pilotage du Dossier
            </h4>
            
            <div className="flex flex-col gap-3">
               <Button 
                  onClick={() => handleUpdateStatus('UNDER_REVIEW')}
                  disabled={isUpdating}
                  className="w-full bg-slate-50 border-2 border-slate-100 text-primary hover:bg-slate-100 rounded-full py-7 font-black uppercase text-[10px] tracking-widest italic"
               >
                  Passer en Revue <History size={16} className="ml-2" />
               </Button>
               <Button 
                  variant="outline"
                  onClick={() => handleUpdateStatus('NEEDS_INFO')}
                  disabled={isUpdating}
                  className="w-full rounded-full py-7 border-amber-100 text-amber-600 hover:bg-amber-50 font-black uppercase text-[10px] tracking-widest italic"
               >
                  Besoin d'infos <MessageSquare size={16} className="ml-2" />
               </Button>
               <Button 
                  variant="outline"
                  onClick={() => handleUpdateStatus('REJECTED')}
                  disabled={isUpdating}
                  className="w-full rounded-full py-7 border-red-100 text-red-500 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest italic"
               >
                  Rejeter la demande <History size={16} className="ml-2" />
               </Button>
            </div>
         </div>

         {/* Client Info Card */}
         <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-10 pb-4 italic tracking-tighter">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 italic">
                  <User size={16} className="text-secondary italic" /> Émetteur du dossier
               </CardTitle>
            </CardHeader>
            <CardContent className="px-10 pb-10 space-y-6">
               <div className="flex items-center gap-4 italic">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary font-black text-lg">
                     {request.client.firstName[0]}{request.client.lastName[0]}
                  </div>
                  <div>
                     <div className="text-sm font-black text-primary uppercase italic">{request.client.firstName} {request.client.lastName}</div>
                     <div className="text-[10px] text-muted-foreground font-bold uppercase italic tracking-widest">Client Premium</div>
                  </div>
               </div>
               <div className="space-y-4 pt-4 border-t border-slate-50 italic">
                  <div className="flex items-center gap-3 text-sm font-bold text-primary italic">
                     <Mail size={16} className="text-muted-foreground opacity-50" />
                     {request.client.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-primary italic">
                     <Phone size={16} className="text-muted-foreground opacity-50" />
                     {request.client.phone || 'N/A'}
                  </div>
               </div>
               <div className="pt-4 border-t border-slate-50 italic">
                  <Link href={`/admin/compliance/${request.clientId}`} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline flex items-center gap-2 italic tracking-tighter italic">
                     Voir profil complet <ArrowRight size={14} />
                  </Link>
               </div>
            </CardContent>
         </Card>

         {/* Quick Financial Summary Card */}
         <div className="bg-primary text-white rounded-[40px] p-10 space-y-6 relative overflow-hidden group italic shadow-xl shadow-primary/20 italic tracking-tighter">
            <TrendingUp size={100} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 italic">Estimation Revenu Sharufa</h4>
            <div className="space-y-6 relative z-10 italic">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 italic tracking-tighter">Total Devis Actif</p>
                  <p className="text-3xl font-black italic">$ {activeQuote ? activeQuote.totalPrice.toLocaleString() : '0'}</p>
               </div>
               <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary italic">Service Fee Share</p>
                  <p className="text-xl font-black italic">$ {activeQuote ? activeQuote.serviceFee.toLocaleString() : '0'}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
