import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Plus,
  Send,
  User,
  Info
} from 'lucide-react'
import { LogisticsStatus } from '@prisma/client'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { OperationalActionPanel } from '@/components/cargo/OperationalActionPanel'
import QualityCheckPanel from '@/components/cargo/QualityCheckPanel'

export default async function CargoOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true, cargoId: true, cargo: { select: { transportType: true } } }
  })

  if (profile?.role !== 'CARGO' && profile?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: true,
      items: {
        include: {
          product: true
        }
      },
      trackingEvents: {
        orderBy: { createdAt: 'desc' },
        include: { createdBy: true }
      },
      qualityCheck: {
        include: { media: true }
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' },
        include: { changedBy: true }
      }
    }
  })

  if (!order) {
    notFound()
  }

  let isQcRequired = false;
  if (order.originCountry) {
    const country = await prisma.country.findFirst({
      where: {
         OR: [
          { name: { equals: order.originCountry, mode: 'insensitive' } },
          { code: { equals: order.originCountry, mode: 'insensitive' } }
         ]
      }
    })
    isQcRequired = country?.qualityCheckRequired ?? false;
  }

  if (profile?.role === 'CARGO' && order.cargoId !== profile.cargoId) {
    redirect('/cargo')
  }

  // Fetch batches if Maritime cargo
  const batches = profile?.cargo?.transportType === 'SEA' 
    ? await prisma.shipmentBatch.findMany({
        where: { cargoId: profile.cargoId, status: 'OPEN' },
        orderBy: { createdAt: 'desc' }
      })
    : []

  return (
    <div className="space-y-10 max-w-7xl pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/cargo" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Espace Opérateur Cargo</div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter italic">#{order.orderNumber}</h1>
          </div>
        </div>
        
        <Badge className="px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest bg-slate-900 text-white flex items-center gap-2">
           <Truck size={14} className="text-secondary" /> {(order.logisticsStatus || 'NEW_ORDER').replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {isQcRequired && (
            <QualityCheckPanel 
              orderId={order.id} 
              existingCheck={order.qualityCheck} 
            />
          )}

          {/* Operational Workflow Panel */}
          <Card className="rounded-[40px] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white italic">
            <CardHeader className="bg-[#002B24] text-white p-10 italic">
               <div className="flex items-center gap-3">
                  <Plus className="text-secondary" size={24} />
                  <div>
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] italic">Pilotage Opérationnel</CardTitle>
                    <p className="text-white/50 text-[10px] uppercase font-bold mt-1">Actions logistiques contrôlées</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-10">
               <OperationalActionPanel 
                 orderId={order.id}
                 currentStatus={order.logisticsStatus}
                 globalStatus={order.status}
                 qcApproved={order.qualityCheck?.status === 'APPROVED'}
                 qcRequired={isQcRequired}
                 originCity={order.originCountry || ""}
                 cargoTransportType={profile?.cargo?.transportType || 'AIR'}
                 availableBatches={batches.map(b => ({ id: b.id, batchNumber: b.batchNumber }))}
               />
            </CardContent>
          </Card>

          {/* Activity Log / Timeline */}
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
               <div className="flex items-center gap-3">
                  <Clock className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Historique du colis</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-10">
                {order.statusHistory.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground italic">
                     Aucun événement logistique enregistré.
                  </div>
                ) : (
                  <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                     {order.statusHistory.map((history, idx) => (
                        <div key={history.id} className="relative">
                           <div className={cn(
                             "absolute -left-8 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10",
                             idx === 0 ? "border-secondary scale-110 shadow-lg shadow-secondary/20" : "border-slate-200"
                           )}>
                              <div className={cn("w-2 h-2 rounded-full", idx === 0 ? "bg-secondary animate-pulse" : "bg-slate-300")} />
                           </div>
                           
                           <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-sm font-black text-primary uppercase tracking-tight italic">
                                    {history.new.replace(/_/g, ' ')}
                                 </h4>
                                 <span className="text-[9px] font-bold text-muted-foreground uppercase italic px-3 py-1 bg-slate-50 rounded-full">
                                    {format(new Date(history.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                 </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest italic">
                                 <span className="text-muted-foreground flex items-center gap-1">
                                    <User size={10} /> {history.changedBy?.firstName || 'Système'} ({history.changedByRole})
                                 </span>
                              </div>
                              
                              {history.note && (
                                 <p className="text-sm font-medium text-slate-500 italic mt-2 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    {history.note}
                                 </p>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-10">
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white italic">
               <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <Info size={16} className="text-secondary" /> Détails Livraison
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-4">
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Client</span>
                        <span className="text-sm font-black text-primary uppercase">{order.client.firstName} {order.client.lastName}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Adresse complète</span>
                        <span className="text-xs font-bold text-slate-600 leading-relaxed italic">{order.shippingAddress}</span>
                     </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-50">
                     <div className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Produits commandés ({order.items.length})</div>
                     <div className="space-y-2">
                        {order.items.map(item => (
                           <div key={item.id} className="text-xs font-black text-primary uppercase truncate">
                              • {item.product.name} (x{item.quantity})
                           </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
           </Card>
           
           <div className="p-8 bg-amber-50 rounded-[40px] border-2 border-dashed border-amber-200 italic space-y-4">
              <div className="flex items-center gap-2 text-amber-700 font-black uppercase text-[10px] tracking-widest">
                 <ShieldAlert size={16} /> Rappel de Conformité
              </div>
              <p className="text-xs font-bold text-amber-900/70 leading-relaxed">
                 Toute mise à jour logistique est visible instantanément par le client. 
                 Veuillez vous assurer de la véracité des localisations.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}

function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}
