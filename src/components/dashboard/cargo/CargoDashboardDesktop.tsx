'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowRight, Plane, Ship, Package, Box } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CargoDashboardDesktopProps {
  profile: any
  orders: any[]
  stats: any
  transportType: string
  batches?: any[]
}

export function CargoDashboardDesktop({
  profile,
  orders,
  stats,
  transportType,
  batches = []
}: CargoDashboardDesktopProps) {
  const isAir = transportType === 'AIR'
  const isSea = transportType === 'SEA'

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter italic uppercase flex items-center gap-3">
               Pilotage <span className="text-secondary italic">{isAir ? 'Aérien' : isSea ? 'Maritime' : 'Logistique'}</span>
               {isAir ? <Plane size={32} className="text-blue-500" /> : <Ship size={32} className="text-emerald-500" />}
            </h1>
            <p className="text-muted-foreground font-medium italic">Gestion des expéditions pour la route {profile.cargo?.originCountry} → {profile.cargo?.destinationCountry}</p>
         </div>

         {isSea && (
            <Button asChild className="rounded-2xl h-12 px-8 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 border-none font-black uppercase text-[10px] tracking-widest italic">
               <Link href="/cargo/batches">
                  <Box size={16} className="mr-2" /> Gérer les Lots / Batches
               </Link>
            </Button>
         )}
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Total Commandes</div>
            <div className="text-3xl font-black text-primary italic">{stats.total}</div>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> À Traiter
            </div>
            <div className="text-3xl font-black text-primary italic">{stats.pending}</div>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500" /> En Transit
            </div>
            <div className="text-3xl font-black text-primary italic">{stats.inTransit}</div>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-4 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500" /> Livrées
            </div>
            <div className="text-3xl font-black text-primary italic">{stats.delivered}</div>
         </div>
      </div>

      {isSea && batches.length > 0 && (
         <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary italic px-2">Lots Maritime Actifs ({batches.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {batches.map(batch => (
                  <div key={batch.id} className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Package size={24} />
                        </div>
                        <div>
                           <p className="text-xs font-black uppercase tracking-widest text-primary font-mono leading-none mb-1">Lot #{batch.batchNumber}</p>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase italic">{batch._count.orders} commandes consolidées</p>
                        </div>
                     </div>
                     <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-black uppercase px-3 py-1">
                        {batch.status}
                     </Badge>
                  </div>
               ))}
            </div>
         </section>
      )}

      {/* Manifest Table */}
      <Card className="border-none shadow-sm bg-white rounded-[40px] overflow-hidden italic">
         <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary italic flex items-center gap-2">
               <Box size={16} className="text-secondary" /> Manifeste de Transport
            </h3>
            <span className="text-[10px] font-black text-muted-foreground uppercase">{orders.length} entrées détectées</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commande</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Client</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destination</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Articles</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Statut</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-10 py-24 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                           <Package size={48} />
                           <p className="font-black uppercase text-xs tracking-widest">Aucune commande en attente</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/30 transition-colors italic group">
                         <td className="px-10 py-6">
                            <span className="text-sm font-black text-primary uppercase leading-none">#{order.orderNumber}</span>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                               {format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="text-sm font-black text-primary uppercase">{order.client.firstName} {order.client.lastName}</div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-primary italic">
                               <MapPin size={12} className="text-secondary" />
                               {order.destinationCountry}
                            </div>
                         </td>
                         <td className="px-10 py-6 text-xs font-bold text-slate-500">
                            {order.items.length} positions
                         </td>
                          <td className="px-10 py-6">
                             <Badge variant="outline" className={cn(
                                "rounded-full font-black uppercase text-[9px] tracking-widest py-1 px-4 border-none shadow-sm",
                                order.logisticsStatus === 'DELIVERED' ? "bg-green-100 text-green-700" : 
                                order.logisticsStatus === 'REJECTED_BY_CARGO' ? "bg-red-100 text-red-700" :
                                order.logisticsStatus === 'DROPPED_AT_CARGO' ? "bg-amber-100 text-amber-700" :
                                "bg-indigo-100 text-indigo-700"
                             )}>
                                {(order.logisticsStatus || 'NEW_ORDER').replace(/_/g, ' ')}
                             </Badge>
                          </td>
                         <td className="px-10 py-6 text-right">
                            <Button asChild variant="outline" className="rounded-xl h-10 px-6 border-slate-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all font-black uppercase text-[10px] tracking-widest">
                               <Link href={`/cargo/orders/${order.id}`}>
                                  Gérer <ArrowRight size={14} className="ml-2" />
                                </Link>
                            </Button>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  )
}
