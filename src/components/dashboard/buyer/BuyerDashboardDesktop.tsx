'use client'

import React from 'react'
import { StatCard } from '../StatCard'
import { RecentOrders } from '../RecentOrders'
import { RecentSourcing } from '../RecentSourcing'
import { useEffect, useState } from 'react'

interface BuyerDashboardDesktopProps {
  profile: any
  orderCount: number
  sourcingCount: number
  totalSpent: any
  recentOrders: any[]
  recentSourcing: any[]
}

export function BuyerDashboardDesktop({
  profile,
  orderCount,
  sourcingCount,
  totalSpent,
  recentOrders,
  recentSourcing
}: BuyerDashboardDesktopProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const formattedAmount = mounted 
    ? (totalSpent?._sum?.totalAmount || 0).toLocaleString() 
    : '...'

  return (
    <div className="space-y-10">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                 Espace Acheteur
               </span>
            </div>
            <h1 className="text-5xl font-black font-outfit text-primary tracking-tighter leading-tight">
               Bonjour, <span className="text-secondary italic">{profile?.firstName || 'Client'}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">Suivez vos achats et demandes de sourcing en temps réel sur Sharufa.</p>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-8">
         <StatCard 
            title="Mes Commandes" 
            value={orderCount} 
            iconName="shopping-bag" 
            description="Total des achats effectués"
            color="primary"
         />
         <StatCard 
            title="Mes Sourcing" 
            value={sourcingCount} 
            iconName="package" 
            description="Demandes d&apos;importation"
            color="secondary"
         />
         <StatCard 
            title="Total Dépensé" 
            value={`$ ${formattedAmount}`} 
            iconName="trending-up" 
            description="Volume d&apos;achat total"
            color="blue"
         />
      </div>

      {/* Main Tables Area */}
      <div className="grid grid-cols-1 gap-10">
         <RecentOrders orders={recentOrders} />
         <RecentSourcing requests={recentSourcing as any} />
      </div>
    </div>
  )
}
