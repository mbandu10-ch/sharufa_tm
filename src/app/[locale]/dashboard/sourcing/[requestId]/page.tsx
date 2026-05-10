import React from 'react'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Boxes, 
  MapPin, 
  Globe, 
  Package, 
  CreditCard,
  Truck,
  History,
  Archive,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClientQuoteView } from '@/components/dashboard/sourcing/ClientQuoteView'
import { AuditLogList } from '@/components/admin/compliance/AuditLogList'
import { createClient } from '@/utils/supabase/server'
import { cn } from '@/lib/utils'

export default async function UserSourcingDetailPage({ params }: { params: Promise<{ requestId: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { requestId } = await params
  
  const request = await prisma.sourcingRequest.findUnique({
    where: { 
      id: requestId,
      clientId: user.id // Sécurité : Seul le propriétaire peut voir
    },
    include: {
      quotes: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      events: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!request) {
    notFound()
  }

  const activeQuote = request.quotes[0]

  return (
    <div className="space-y-12 pb-20 italic tracking-tighter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 italic tracking-tighter">
        <div className="flex items-center gap-6 italic tracking-tighter">
          <Link 
            href="/dashboard/sourcing" 
            className="w-14 h-14 rounded-3xl bg-white border border-primary/5 flex items-center justify-center text-primary hover:bg-secondary hover:text-primary transition-all shadow-sm"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 italic">Suivi de votre dossier Sourcing</div>
             <h1 className="text-2xl font-black text-primary uppercase tracking-tight italic flex items-center gap-3">
                {request.type === 'B2B' ? <Boxes size={24} className="text-secondary" /> : <Zap size={24} className="text-secondary" />}
                {request.title || 'Recherche de Produit'}
             </h1>
          </div>
        </div>

        <Badge className={cn(
           "px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest border-none shadow-lg italic",
           request.status === 'QUOTED' ? "bg-secondary text-primary animate-pulse shadow-secondary/20" : "bg-slate-100 text-slate-500 shadow-slate-100/30"
        )}>
           {request.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 italic tracking-tighter">
         <div className="lg:col-span-2 space-y-12 italic tracking-tighter">
            {/* Status Info Card */}
            <div className="bg-white rounded-[48px] p-10 md:p-14 border border-primary/5 shadow-sm italic tracking-tighter">
               <div className="flex items-center gap-4 mb-10 italic tracking-tighter">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                     <ShieldCheck size={24} />
                  </div>
                  <h2 className="text-xl font-black text-primary uppercase tracking-tighter italic">Récapitulatif de la recherche</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 italic tracking-tighter">
                  <div className="space-y-8 italic tracking-tighter">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 italic tracking-tighter">Votre Description</p>
                        <p className="text-sm font-bold text-primary leading-relaxed italic">{request.description}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-6 italic tracking-tighter">
                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 italic tracking-tighter">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic tracking-tighter">Pays Cible</p>
                           <p className="text-xs font-black text-primary italic uppercase tracking-tighter italic tracking-tighter">{request.targetCountry || 'Tous Pays'}</p>
                        </div>
                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 italic tracking-tighter">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic tracking-tighter italic tracking-tighter">Qté Demandée</p>
                           <p className="text-xs font-black text-primary italic tracking-tighter italic tracking-tighter">{request.requestedQuantity} unité(s)</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-8 italic tracking-tighter">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic tracking-tighter italic tracking-tighter">Image de référence</p>
                     <div className="aspect-square rounded-[40px] bg-slate-100 overflow-hidden border border-slate-100 italic tracking-tighter">
                        {request.imageUrl ? (
                           <img src={request.imageUrl} alt="Sourcing" className="w-full h-full object-cover italic tracking-tighter" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300 italic tracking-tighter">
                              <Archive size={48} className="opacity-40 italic tracking-tighter" />
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Display active quote if exists */}
            {activeQuote ? (
               <ClientQuoteView quote={activeQuote} requestId={request.id} />
            ) : (
               <div className="bg-primary p-12 md:p-16 rounded-[48px] text-white flex flex-col items-center text-center gap-8 italic tracking-tighter">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-secondary italic tracking-tighter">
                     <Clock size={40} className="animate-spin-slow italic tracking-tighter" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Analyse en cours par nos experts</h3>
                     <p className="text-white/40 font-medium italic tracking-widest text-[11px] uppercase max-w-md">
                        Votre demande est transmise à nos agents en Turquie, Chine et Dubaï. Vous recevrez un devis personnalisé sous 24 à 48h.
                     </p>
                  </div>
               </div>
            )}
         </div>

         <div className="space-y-12 italic tracking-tighter">
            {/* Steps Guide */}
            <div className="bg-white rounded-[48px] p-10 border border-primary/5 shadow-sm space-y-8 italic tracking-tighter">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 italic">
                  <ShieldCheck size={16} className="text-secondary italic" /> Étapes de Validation
               </h4>
               <div className="space-y-6 italic tracking-tighter">
                  {[
                     { step: 1, label: "Demande Envoyée", status: "completed" },
                     { step: 2, label: "Revue Admin", status: request.status !== 'NEW' ? "completed" : "pending" },
                     { step: 3, label: "Réception Devis", status: request.status === 'QUOTED' || ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(request.status) ? "completed" : "pending" },
                     { step: 4, label: "Acceptation & Paiement", status: ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(request.status) ? "completed" : "pending" }
                  ].map((s) => (
                     <div key={s.step} className="flex items-center gap-4 italic tracking-tighter">
                        <div className={cn(
                           "w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black border-2 italic",
                           s.status === 'completed' ? "bg-primary text-white border-primary" : "bg-white text-slate-200 border-slate-100"
                        )}>
                           {s.status === 'completed' ? <CheckCircle2 size={16} /> : s.step}
                        </div>
                        <span className={cn(
                           "text-[10px] font-black uppercase tracking-widest italic tracking-tighter",
                           s.status === 'completed' ? "text-primary italic" : "text-slate-300 italic"
                        )}>
                           {s.label}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Sourcing History / Timeline */}
            <div className="bg-slate-50/50 rounded-[48px] p-10 border border-primary/5 italic tracking-tighter">
               <div className="flex items-center gap-3 mb-8 italic tracking-tighter">
                  <History size={18} className="text-secondary italic" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary italic tracking-tighter">Journal du Dossier</h4>
               </div>
               <AuditLogList events={request.events.map(e => ({ ...e, eventType: e.action }))} />
            </div>
         </div>
      </div>
    </div>
  )
}
