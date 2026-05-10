'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Package, 
  Truck, 
  MapPin, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Plane,
  Ship
} from 'lucide-react'
import { MobileCargoOrderCard } from '../MobileCargoOrderCard'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CargoDashboardMobileProps {
  profile: any
  orders: any[]
  stats: any
  transportType: string
  batches?: any[]
}

export function CargoDashboardMobile({
  profile,
  orders,
  stats,
  transportType,
  batches = []
}: CargoDashboardMobileProps) {
  const isAir = transportType === 'AIR'
  const isSea = transportType === 'SEA'
  return (
    <div className="space-y-8 pb-24">
      {/* Field Tool Header */}
      <div className="space-y-1">
         <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">
           Terrain <span className="text-secondary italic">{isAir ? 'Aérien' : isSea ? 'Maritime' : 'Logistique'}</span>
         </h1>
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white px-3 py-1.5 rounded-2xl border border-slate-100 w-fit">
            {isAir ? <Plane size={10} className="text-blue-500" /> : isSea ? <Ship size={10} className="text-emerald-500" /> : <MapPin size={10} className="text-secondary" />}
            {profile.cargo?.originCountry} → {profile.cargo?.destinationCountry}
         </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
         <div className={cn(
           "p-5 rounded-3xl border shadow-lg flex flex-col gap-2 transition-all",
           stats.pending > 0 ? "bg-amber-600 border-amber-500 text-white scale-105" : "bg-white border-slate-100"
         )}>
            <div className={cn("text-[9px] font-black uppercase tracking-widest", stats.pending > 0 ? "text-white/60" : "text-amber-600")}>À Traiter</div>
            <div className="flex items-end justify-between">
               <div className="text-4xl font-black italic">{stats.pending}</div>
               {stats.pending > 0 && <AlertCircle size={24} className="mb-1 animate-pulse" />}
            </div>
         </div>
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Transit</div>
            <div className="flex items-end justify-between">
               <div className="text-4xl font-black text-primary italic">{stats.inTransit}</div>
               <Truck size={24} className="text-indigo-400 mb-1" />
            </div>
         </div>
         <div className="bg-emerald-600 p-5 rounded-3xl border border-emerald-500 shadow-lg flex flex-col gap-2 text-white">
            <div className="text-[9px] font-black uppercase tracking-widest text-white/60">Livrées</div>
            <div className="flex items-end justify-between">
               <div className="text-4xl font-black italic">{stats.delivered}</div>
               <CheckCircle2 size={24} className="mb-1" />
            </div>
         </div>
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total</div>
            <div className="flex items-end justify-between">
               <div className="text-4xl font-black text-primary italic">{stats.total}</div>
               <Package size={24} className="text-slate-200 mb-1" />
            </div>
         </div>
      </div>

      {/* Maritime Batches Section */}
      {isSea && (
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-black text-primary tracking-tight">Lots en cours</h2>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{batches.length} lots</span>
           </div>
           <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {batches.length === 0 ? (
                <div className="min-w-[200px] h-24 rounded-3xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-[10px] font-bold text-muted-foreground italic">
                  Aucun lot ouvert
                </div>
              ) : (
                batches.map(batch => (
                  <div key={batch.id} className="min-w-[240px] p-5 rounded-[32px] bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                           <Package size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">#{batch.batchNumber}</p>
                           <p className="text-[9px] font-bold text-muted-foreground uppercase italic">{batch._count.orders} commandes</p>
                        </div>
                     </div>
                     <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-black uppercase">
                        {batch.status}
                     </Badge>
                  </div>
                ))
              )}
           </div>
        </section>
      )}

      {/* Field Manifest Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <h2 className="text-lg font-black text-primary tracking-tight">Manifeste terrain</h2>
           <span className="text-[10px] font-bold text-muted-foreground uppercase">{orders.length} ordres</span>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <p className="text-sm font-bold text-muted-foreground italic">Aucun ordre dans le manifeste</p>
            </div>
          ) : (
            orders.map(order => (
              <MobileCargoOrderCard 
                key={order.id} 
                order={order as any} 
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
