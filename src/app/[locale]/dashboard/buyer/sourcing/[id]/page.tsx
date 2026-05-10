import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Package, 
  ShieldCheck, 
  FileText,
  Boxes,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { ClientQuoteView } from '@/components/dashboard/sourcing/ClientQuoteView'

export default async function BuyerSourcingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const request = await prisma.sourcingRequest.findUnique({
    where: { id },
    include: {
      quotes: {
        where: { isActive: true },
        take: 1
      }
    }
  })

  if (!request || request.clientId !== user.id) {
    notFound()
  }

  const activeQuote = request.quotes[0]

  return (
    <div className="space-y-12 max-w-5xl italic">
      <div className="flex items-center gap-4">
         <Link 
            href="/dashboard/buyer/sourcing"
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-secondary hover:border-secondary transition-all shadow-sm"
         >
            <ArrowLeft size={20} />
         </Link>
         <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">Retour aux demandes</div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter italic">
               Détail du <span className="text-secondary italic">Sourcing</span>
            </h1>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            {/* Main Info */}
            <div className="bg-white rounded-[40px] p-10 border border-primary/5 shadow-sm space-y-8 italic">
               <div className="flex flex-wrap items-center gap-4">
                  <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic">
                     {request.type === 'B2B' ? 'Achat Grossiste' : 'Sourcing / Buy For Me'}
                  </Badge>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full italic">
                     Statut : {request.status.replace(/_/g, ' ')}
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-4xl font-black text-primary uppercase tracking-tighter leading-tight italic">
                     {request.title || 'Demande sans titre'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground italic">
                     <div className="flex items-center gap-2 uppercase tracking-widest text-[10px]"><MapPin size={16} className="text-secondary" /> {request.targetCountry}</div>
                     <div className="flex items-center gap-2 uppercase tracking-widest text-[10px]"><Clock size={16} className="text-secondary" /> {format(new Date(request.createdAt), 'dd MMMM yyyy', { locale: fr })}</div>
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 italic">Description du besoin</p>
                  <div className="text-lg text-primary/80 leading-relaxed font-medium whitespace-pre-line italic">
                     {request.description}
                  </div>
               </div>

               {request.imageUrl && (
                  <div className="pt-8 border-t border-slate-50 space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Image de référence</p>
                     <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                        <img src={request.imageUrl} alt="Reference" className="w-full h-full object-cover" />
                     </div>
                  </div>
               )}
            </div>

            {/* Active Quote Section */}
            {activeQuote && (
               <div className="space-y-6 italic">
                  <div className="flex items-center gap-3 italic">
                     <FileText className="text-secondary" />
                     <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic">Proposition Commerciale</h3>
                  </div>
                  <ClientQuoteView quote={activeQuote} requestId={request.id} />
               </div>
            )}
         </div>

         <div className="space-y-8">
            {/* Quick Stats Sidebar */}
            <div className="bg-primary text-white p-8 rounded-[40px] shadow-2xl shadow-primary/20 space-y-8 relative overflow-hidden italic">
               <div className="absolute -right-8 -bottom-8 opacity-10 italic">
                  <Package size={160} />
               </div>
               
               <div className="relative z-10 space-y-6 italic">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 italic">Budget Estimé</p>
                     <p className="text-2xl font-black italic">$ {request.budget?.toLocaleString() || '---'}</p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 italic">Quantité</p>
                     <p className="text-2xl font-black italic">{request.requestedQuantity} unités</p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 italic">Délai estimé</p>
                     <Badge className="bg-secondary text-primary border-none px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest italic">
                        Standard
                     </Badge>
                  </div>
               </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6 italic">
               <div className="flex items-center gap-3 italic">
                  <ShieldCheck className="text-blue-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Processus Sharufa</p>
               </div>
               <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
                  Nos agents vérifient la disponibilité et négocient pour vous. Une fois le devis accepté, votre commande est générée automatiquement.
               </p>
            </div>
         </div>
      </div>
    </div>
  )
}
