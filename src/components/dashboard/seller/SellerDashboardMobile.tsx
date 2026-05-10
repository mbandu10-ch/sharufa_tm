'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Store, 
  ShoppingBag, 
  Package, 
  ChevronRight, 
  ArrowUpRight,
  Clock,
  ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileOrderCard } from '../MobileOrderCard'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface SellerDashboardMobileProps {
  profile: any
  shop: any
  stats: any
  productCount: number
  orderCount: number
  totalSales: any
  recentOrders: any[]
  sourcingLeads: any[]
}

export function SellerDashboardMobile({
  profile,
  shop,
  stats,
  productCount,
  orderCount,
  totalSales,
  recentOrders,
  sourcingLeads
}: SellerDashboardMobileProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const formattedAmount = mounted 
    ? (totalSales._sum.price || 0).toLocaleString() 
    : '...'

  return (
    <div className="space-y-8 pb-24">
      {/* Pending Approval Banner */}
      {shop.status !== 'APPROVED' && (
        <div className={cn(
          "p-6 rounded-[32px] border shadow-lg flex flex-col gap-4",
          shop.status === 'REJECTED' ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              shop.status === 'REJECTED' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            )}>
              {shop.status === 'REJECTED' ? <ShieldAlert size={24} /> : <Clock size={24} className="animate-pulse" />}
            </div>
            <div>
               <h3 className={cn("text-lg font-black uppercase tracking-tight", shop.status === 'REJECTED' ? "text-red-900" : "text-amber-900")}>
                  {shop.status === 'REJECTED' ? 'Demande Refusée' : 'Vérification...'}
               </h3>
               <p className="text-xs font-bold opacity-70">
                  {shop.status === 'REJECTED' ? "Action requise" : "Validation sous 48h"}
               </p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full rounded-2xl h-12 font-black bg-white/50 border-2">
             <Link href="/seller/register">Voir les détails</Link>
          </Button>
        </div>
      )}

      {/* Greeting & Stats Grid */}
      <div className="space-y-6">
        <div>
           <h1 className="text-4xl font-black text-primary tracking-tighter">
             Bonjour, <span className="text-secondary italic">{profile?.firstName || 'Vendeur'}</span>
           </h1>
           <p className="text-muted-foreground text-sm font-bold mt-1">Voici l&apos;état de votre boutique.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Articles</p>
            <p className="text-3xl font-black text-primary tracking-tighter">{productCount}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Ventes</p>
            <p className="text-3xl font-black text-secondary tracking-tighter">{orderCount}</p>
          </div>
          <div className="bg-primary p-6 rounded-[32px] shadow-xl col-span-2 flex items-center justify-between text-white overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors" />
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Chiffre d&apos;affaires</p>
               <p className="text-3xl font-black tracking-tighter">
                 ${formattedAmount}
               </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center relative z-10 backdrop-blur-md border border-white/10">
               <ArrowUpRight size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-2 gap-4">
         <Button asChild className="h-20 rounded-3xl bg-secondary text-primary font-black shadow-lg shadow-secondary/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
            <Link href="/dashboard/seller/products/new">
               <Plus size={24} />
               <span className="text-[10px] uppercase tracking-widest">Nouveau</span>
            </Link>
         </Button>
         <Button asChild variant="outline" className="h-20 rounded-3xl border-2 font-black flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
            <Link href={`/shop/${shop.slug}`}>
               <Store size={24} className="text-secondary" />
               <span className="text-[10px] uppercase tracking-widest">Boutique</span>
            </Link>
         </Button>
         <Button asChild variant="outline" className="h-20 rounded-3xl border-2 font-black flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
            <Link href="/dashboard/seller/products">
               <Package size={24} className="text-secondary" />
               <span className="text-[10px] uppercase tracking-widest">Produits</span>
            </Link>
         </Button>
         <Button asChild variant="outline" className="h-20 rounded-3xl border-2 font-black flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
            <Link href="/dashboard/seller/orders">
               <ShoppingBag size={24} className="text-secondary" />
               <span className="text-[10px] uppercase tracking-widest">Commandes</span>
            </Link>
         </Button>
      </div>

      {/* Recent Orders Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-black text-primary tracking-tight">Dernières ventes</h2>
           <Link href="/dashboard/seller/orders" className="text-xs font-bold text-secondary flex items-center gap-1">
             Tout voir <ChevronRight size={14} />
           </Link>
        </div>
        
        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <p className="text-sm font-bold text-muted-foreground italic">Aucune commande récente</p>
            </div>
          ) : (
            recentOrders.map(order => (
              <MobileOrderCard 
                key={order.id} 
                order={order} 
                href={`/dashboard/seller/orders/${order.id}`}
              />
            ))
          )}
        </div>
      </section>

      {/* Sourcing Opportunities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-black text-primary tracking-tight">Opportunités</h2>
           <Link href="/dashboard/sourcing" className="text-xs font-bold text-secondary flex items-center gap-1">
             Tout voir <ChevronRight size={14} />
           </Link>
        </div>

        <div className="space-y-3">
          {sourcingLeads.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <p className="text-sm font-bold text-muted-foreground italic">Pas de leads aujourd&apos;hui</p>
            </div>
          ) : (
            sourcingLeads.map(lead => (
              <div key={lead.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-50 flex items-center justify-between group active:bg-slate-50 transition-colors">
                <div className="space-y-1">
                   <p className="text-sm font-bold text-primary line-clamp-1">{lead.title}</p>
                   <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{lead.category?.name || 'Catégorie'}</p>
                </div>
                <Link href={`/dashboard/sourcing/${lead.id}`} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary group-active:bg-secondary group-active:text-primary transition-colors">
                  <ChevronRight size={18} />
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
