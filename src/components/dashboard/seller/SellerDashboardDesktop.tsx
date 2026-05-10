'use client'

import React from 'react'
import { StatCard } from '../StatCard'
import { RecentOrders } from '../RecentOrders'
import { OnboardingChecklist } from '../OnboardingChecklist'
import { ProductStatusBreakdown } from '../ProductStatusBreakdown'
import { SourcingLeadsFeed } from '../SourcingLeadsFeed'
import { Plus, ArrowUpRight, Clock, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface SellerDashboardDesktopProps {
  profile: any
  shop: any
  stats: any
  productCount: number
  orderCount: number
  totalSales: any
  recentOrders: any[]
  sourcingLeads: any[]
  hasLegalProfile: boolean
  documentCount: number
}

export function SellerDashboardDesktop({
  profile,
  shop,
  stats,
  productCount,
  orderCount,
  totalSales,
  recentOrders,
  sourcingLeads,
  hasLegalProfile,
  documentCount
}: SellerDashboardDesktopProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const formattedAmount = mounted 
    ? (totalSales._sum.price || 0).toLocaleString() 
    : '...'

  return (
    <div className="space-y-10">
      {/* Pending Approval Banner */}
      {shop.status !== 'APPROVED' && (
        <div className={cn(
          "relative overflow-hidden rounded-[40px] p-12 border shadow-xl flex items-center gap-8 group mb-12",
          shop.status === 'REJECTED' ? "bg-red-50 border-red-100 text-red-900" : "bg-amber-50 border-amber-100 text-amber-900"
        )}>
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center shrink-0",
            shop.status === 'REJECTED' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
          )}>
            {shop.status === 'REJECTED' ? <ShieldAlert size={32} /> : <Clock size={32} className="animate-pulse" />}
          </div>
          <div className="space-y-2 flex-1">
             <h3 className="text-3xl font-black font-outfit uppercase tracking-tighter">
                {shop.status === 'REJECTED' ? 'Demande Refusée' : 'Vérification en cours'}
             </h3>
             <p className="text-lg font-bold opacity-70 leading-relaxed max-w-2xl">
                {shop.status === 'REJECTED' 
                  ? "Votre demande n'a pas été acceptée. Veuillez contacter le support pour plus d'informations."
                  : "Vos produits seront visibles par les acheteurs dès la validation de votre boutique (sous 48h)."}
             </p>
          </div>
          <Button asChild variant="outline" className="rounded-full px-8 h-14 font-black border-2 bg-white/50 backdrop-blur-sm">
             <Link href="/seller/register">Voir les détails</Link>
          </Button>
        </div>
      )}

      {/* Onboarding Checklist */}
      {(shop.status === 'PENDING' || shop.status === 'UNDER_REVIEW') && (
        <OnboardingChecklist 
          shopId={shop.id}
          hasLegalProfile={hasLegalProfile}
          documentCount={documentCount}
          productCount={productCount}
          hasLogo={!!shop.logo}
        />
      )}

      {/* Header & Greeting */}
      <div className="flex items-end justify-between gap-6">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                 Dashboard Vendeur
               </span>
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">
                 {shop.name}
               </span>
            </div>
            <h1 className="text-5xl font-black font-outfit text-primary tracking-tighter leading-tight">
               Bonjour, <span className="text-secondary italic">{profile?.firstName || 'Partenaire'}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">Voici l&apos;état actuel de vos opérations chez Sharufa.</p>
            
            <div className="pt-2">
               <ProductStatusBreakdown 
                 approved={stats.approved}
                 pending={stats.pending}
                 rejected={stats.rejected}
               />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="rounded-full border-2 border-slate-100 px-6 h-14 font-bold text-primary hover:bg-slate-50">
               <Link href={`/shop/${shop.slug}`} target="_blank">
                  Voir ma boutique <ArrowUpRight className="ml-2" size={18} />
               </Link>
            </Button>
            <Button asChild className="rounded-full bg-primary text-white h-14 px-8 font-black shadow-2xl shadow-primary/20 group">
               <Link href="/dashboard/seller/products/new">
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" /> Nouveau Produit
               </Link>
            </Button>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-8">
         <StatCard 
            title="Produits Actifs" 
            value={productCount} 
            iconName="package" 
            description="Articles actuellement en ligne"
            color="primary"
         />
         <StatCard 
            title="Commandes Reçues" 
            value={orderCount} 
            iconName="shopping-bag" 
            description="Volumes de transactions"
            color="secondary"
         />
         <StatCard 
            title="Volume de Vente" 
            value={`$ ${formattedAmount}`} 
            iconName="trending-up" 
            description="Chiffre d&apos;affaires total"
            color="blue"
         />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-3 gap-10">
         <div className="col-span-2">
            <RecentOrders orders={recentOrders} />
         </div>
         <div className="col-span-1">
            <SourcingLeadsFeed 
               leads={sourcingLeads as any} 
               shopType={shop.type} 
            />
         </div>
      </div>
    </div>
  )
}
