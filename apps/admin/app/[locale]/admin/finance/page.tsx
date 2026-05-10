import React from 'react'
import { prisma } from '@sharufa/db'
import { AdminFinanceTable } from '@/components/admin/finance/AdminFinanceTable'
import { DollarSign, TrendingUp, CreditCard, Landmark, Wallet, Layers, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function AdminFinancePage() {
  const shops = await prisma.shop.findMany({
    include: {
      financialTransactions: true,
      documents: {
        where: { type: 'RIB', verificationStatus: 'VERIFIED' }
      }
    }
  })

  // Agrégation des données par boutique
  const vendors = shops.map(shop => {
    const totalSales = shop.financialTransactions.reduce((acc, t) => acc + t.totalAmount, 0)
    const totalCommission = shop.financialTransactions.reduce((acc, t) => acc + t.commissionAmount, 0)
    const netToPay = shop.financialTransactions.filter(t => t.status !== 'PAID').reduce((acc, t) => acc + t.netAmount, 0)
    const totalPaid = shop.financialTransactions.filter(t => t.status === 'PAID').reduce((acc, t) => acc + t.netAmount, 0)
    
    // Déterminer le statut global (si au moins une transaction est ELIGIBLE, on affiche ELIGIBLE)
    let status = 'PENDING'
    if (shop.financialTransactions.some(t => t.status === 'ELIGIBLE')) status = 'ELIGIBLE'
    if (shop.financialTransactions.some(t => t.status === 'ON_HOLD')) status = 'ON_HOLD'
    if (shop.financialTransactions.every(t => t.status === 'PAID') && shop.financialTransactions.length > 0) status = 'PAID'

    return {
      id: shop.id,
      name: shop.name,
      country: shop.country,
      totalSales,
      totalCommission,
      netToPay,
      totalPaid,
      status,
      hasValidRib: shop.documents.length > 0
    }
  })

  const stats = {
    revenue: vendors.reduce((acc, v) => acc + v.totalCommission, 0),
    eligiblePayouts: vendors.filter(v => v.status === 'ELIGIBLE').reduce((acc, v) => acc + v.netToPay, 0),
    totalTransactions: shops.reduce((acc, s) => acc + s.financialTransactions.length, 0),
    totalPaid: vendors.reduce((acc, v) => acc + v.totalPaid, 0)
  }

  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-secondary mb-2 uppercase tracking-widest text-[10px] font-black">
              <Landmark size={20} />
              <span>Pilotage Financier Marketplace</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tighter italic">Commissions & Revenus</h1>
           <p className="text-muted-foreground font-medium mt-2 max-w-xl leading-relaxed italic">
             Surveillez les bénéfices Sharufa, calculez les gains vendeurs et libérez les paiements en fonction de la conformité bancaire.
           </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center">
              <div className="text-2xl font-black text-primary leading-none mb-1 italic">{stats.totalTransactions}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic tracking-tighter">Flux Capturés</div>
           </div>
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center ring-2 ring-secondary/10">
              <div className="text-2xl font-black text-secondary leading-none mb-1 italic">{stats.revenue.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic tracking-tighter">Revenus Sharufa ($)</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-primary p-8 rounded-[40px] flex flex-col justify-between group overflow-hidden relative shadow-xl shadow-primary/10 transition-transform hover:scale-[1.02]">
            <TrendingUp size={100} className="absolute -right-6 -bottom-6 text-white/5 opacity-40 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 italic">Bénéfice Net Sharufa</h3>
               <p className="text-2xl font-black text-white italic">$ {stats.revenue.toLocaleString()}</p>
            </div>
         </div>
         <div className="bg-white border border-primary/5 p-8 rounded-[40px] flex flex-col justify-between shadow-sm">
            <div>
               <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 italic">Virements Éligibles</h3>
               <p className="text-2xl font-black text-primary italic text-green-600">$ {stats.eligiblePayouts.toLocaleString()}</p>
            </div>
            <div className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-4 italic tracking-tighter">Prêt à décaisser ⇾</div>
         </div>
         <div className="bg-white border border-primary/5 p-8 rounded-[40px] flex flex-col justify-between shadow-sm">
            <div>
               <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 italic">Cumul Payé Vendeurs</h3>
               <p className="text-2xl font-black text-primary italic">$ {stats.totalPaid.toLocaleString()}</p>
            </div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-4 italic tracking-tighter">Volume Sortant ⇾</div>
         </div>
         <div className="bg-secondary p-8 rounded-[40px] flex flex-col justify-between shadow-xl shadow-secondary/10 relative overflow-hidden group">
            <ShieldCheck size={100} className="absolute -right-6 -bottom-6 text-primary/5 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-4 italic">Sécurité Financière</h3>
               <p className="text-2xl font-black text-primary italic">100% Audit</p>
            </div>
         </div>
      </div>

      <div className="bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-primary/5 shadow-inner">
         <AdminFinanceTable vendors={vendors} />
      </div>
    </div>
  )
}
