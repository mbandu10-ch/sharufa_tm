import React from 'react'
import { prisma } from '@sharufa/db'
import { AdminOrderTable } from '@/components/admin/orders/AdminOrderTable'
import { ShoppingBag, TrendingUp, CreditCard, Clock, MapPin } from 'lucide-react'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      client: true,
      shop: true,
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Statistiques des ventes
  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'NEW').length,
    processing: orders.filter(o => o.status === 'PROCESSING' || o.status === 'READY_TO_SHIP').length,
    revenue: orders.filter(o => o.paymentStatus === 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0),
    issues: orders.filter(o => o.status === 'ISSUE').length
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-secondary mb-2">
              <ShoppingBag size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pilotage des Flux</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tighter italic">Gestion des Commandes</h1>
           <p className="text-muted-foreground font-medium mt-2 max-w-xl leading-relaxed italic">
             Orchestrez la logistique, surveillez les paiements et résolvez les incidents pour garantir une expérience client premium.
           </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center">
              <div className="text-2xl font-black text-primary leading-none mb-1">{stats.new}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic">Nouvelles</div>
           </div>
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center ring-2 ring-secondary/10">
              <div className="text-2xl font-black text-secondary leading-none mb-1 italic">{stats.revenue.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic">Revenu ($)</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-primary p-8 rounded-[40px] flex flex-col justify-between group overflow-hidden relative shadow-xl shadow-primary/10 transition-transform hover:scale-[1.02]">
            <TrendingUp size={100} className="absolute -right-6 -bottom-6 text-white/5 opacity-40 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 italic">Taux de Conversion</h3>
               <p className="text-2xl font-black text-white italic">-- %</p>
            </div>
         </div>
         <div className="bg-white border border-primary/5 p-8 rounded-[40px] flex flex-col justify-between shadow-sm">
            <div>
               <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 italic">En cours de traitement</h3>
               <p className="text-2xl font-black text-primary italic">{stats.processing}</p>
            </div>
            <div className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-4">Logistique Active ⇾</div>
         </div>
         <div className="bg-white border border-primary/5 p-8 rounded-[40px] flex flex-col justify-between shadow-sm">
            <div>
               <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 italic">Litiges & Problèmes</h3>
               <p className={cn("text-2xl font-black italic", stats.issues > 0 ? "text-red-500" : "text-primary")}>{stats.issues}</p>
            </div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-4 italic">Surveillance ⇾</div>
         </div>
         <div className="bg-secondary p-8 rounded-[40px] flex flex-col justify-between shadow-xl shadow-secondary/10">
            <div>
               <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-4">Commandes Total</h3>
               <p className="text-2xl font-black text-primary italic">{stats.total}</p>
            </div>
            <div className="text-[9px] font-black text-primary uppercase tracking-widest mt-4">Historique Global ⇾</div>
         </div>
      </div>

      <div className="bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-primary/5 shadow-inner">
         <AdminOrderTable orders={orders} />
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
