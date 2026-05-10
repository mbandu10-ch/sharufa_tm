'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Plus, 
  ShoppingBag, 
  Package, 
  ChevronRight, 
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react'
import { MobileOrderCard } from '../MobileOrderCard'
import { MobileSourcingCard } from '../MobileSourcingCard'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface BuyerDashboardMobileProps {
  profile: any
  orderCount: number
  sourcingCount: number
  totalSpent: any
  recentOrders: any[]
  recentSourcing: any[]
}

export function BuyerDashboardMobile({
  profile,
  orderCount,
  sourcingCount,
  totalSpent,
  recentOrders,
  recentSourcing
}: BuyerDashboardMobileProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const formattedAmount = mounted 
    ? (totalSpent?._sum?.totalAmount || 0).toLocaleString() 
    : '...'

  return (
    <div className="space-y-8 pb-24">
      {/* Greeting */}
      <div className="space-y-1">
         <h1 className="text-4xl font-black text-primary tracking-tighter">
           Bonjour, <span className="text-secondary italic">{profile?.firstName || 'Acheteur'}</span>
         </h1>
         <p className="text-muted-foreground text-sm font-bold">Suivez vos importations et achats.</p>
      </div>

      {/* Quick Stats Banner */}
      <div className="relative overflow-hidden bg-primary rounded-[32px] p-6 text-white shadow-2xl">
         <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
         <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Volume d&apos;achat total</p>
                <p className="text-4xl font-black tracking-tighter">
                  ${formattedAmount}
                </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
               <TrendingUp size={28} />
            </div>
         </div>
      </div>

      {/* Two Column Mini Stats */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commandes</p>
            <p className="text-2xl font-black text-primary">{orderCount}</p>
         </div>
         <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sourcing</p>
            <p className="text-2xl font-black text-secondary">{sourcingCount}</p>
         </div>
      </div>

      {/* Active Orders Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-black text-primary tracking-tight">Commandes en cours</h2>
           <Link href="/dashboard/buyer/orders" className="text-xs font-bold text-secondary">Tout voir</Link>
        </div>
        
        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <p className="text-sm font-bold text-muted-foreground italic">Aucune commande en cours</p>
            </div>
          ) : (
            recentOrders.map(order => (
              <MobileOrderCard 
                key={order.id} 
                order={order} 
                href={`/dashboard/buyer/orders/${order.id}`}
              />
            ))
          )}
        </div>
      </section>

      {/* Sourcing Requests Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-black text-primary tracking-tight">Mes Sourcing (Buy For Me)</h2>
           <Link href="/dashboard/buyer/sourcing" className="text-xs font-bold text-secondary">Tout voir</Link>
        </div>

        <div className="space-y-4">
          {recentSourcing.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <p className="text-sm font-bold text-muted-foreground italic">Aucune demande de sourcing</p>
            </div>
          ) : (
            recentSourcing.map(request => (
              <MobileSourcingCard 
                key={request.id} 
                request={request as any} 
                href={`/dashboard/buyer/sourcing/${request.id}`}
              />
            ))
          )}
        </div>
      </section>

      {/* Floating Action Button for Sourcing */}
      <Link 
        href="/dashboard/buyer/sourcing/new"
        className="fixed bottom-6 right-6 w-16 h-16 bg-secondary text-primary rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform ring-4 ring-white"
      >
        <Plus size={32} strokeWidth={3} />
      </Link>
    </div>
  )
}
