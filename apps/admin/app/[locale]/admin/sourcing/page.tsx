import React from 'react'
import { prisma } from '@sharufa/db'
import { AdminSourcingTable } from '@/components/admin/sourcing/AdminSourcingTable'
import { Briefcase, Zap, Boxes, TrendingUp, Search, Layers, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function AdminSourcingPage() {
  const requests = await prisma.sourcingRequest.findMany({
    include: {
      client: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'NEW').length,
    quoted: requests.filter(r => r.status === 'QUOTED').length,
    b2b: requests.filter(r => r.type === 'B2B').length,
    buyForMe: requests.filter(r => r.type === 'BUY_FOR_ME').length
  }

  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
        <div>
           <div className="flex items-center gap-3 text-secondary mb-2 italic">
              <Globe size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Centre de Sourcing International</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tighter italic">Achat & Commission</h1>
           <p className="text-muted-foreground font-medium mt-2 max-w-xl leading-relaxed italic">
             Pilotez les demandes Buy For Me (particuliers) et Sourcing B2B. Envoyez des devis personnalisés et transformez les recherches clients en ventes fermes.
           </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center ring-2 ring-primary/5">
              <div className="text-2xl font-black text-primary leading-none mb-1 italic">{stats.new}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic tracking-tighter">À Examiner</div>
           </div>
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center relative overflow-hidden group">
              <TrendingUp size={60} className="absolute -right-4 -bottom-4 text-secondary/10 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-black text-secondary leading-none mb-1 italic">{stats.total}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic tracking-tighter">Total Demandes</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-primary p-8 rounded-[40px] flex flex-col justify-between group overflow-hidden relative shadow-xl shadow-primary/10 transition-transform hover:scale-[1.02] italic">
            <Boxes size={100} className="absolute -right-6 -bottom-6 text-white/5 opacity-40 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 italic tracking-tighter">Sourcing B2B</h3>
               <p className="text-2xl font-black text-white italic">{stats.b2b} dossiers</p>
            </div>
         </div>
         <div className="bg-white border border-primary/5 p-8 rounded-[40px] flex flex-col justify-between shadow-sm italic">
            <div>
               <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 italic tracking-tighter italic">Buy For Me (B2C)</h3>
               <p className="text-2xl font-black text-primary italic">{stats.buyForMe} dossiers</p>
            </div>
            <div className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-4 italic tracking-tighter">Particuliers ⇾</div>
         </div>
         <div className="bg-white border border-primary/5 p-8 rounded-[40px] flex flex-col justify-between shadow-sm">
            <div>
               <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 italic tracking-tighter">Devis en attente client</h3>
               <p className="text-2xl font-black text-secondary italic tracking-tighter italic">{stats.quoted}</p>
            </div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-4 italic tracking-tighter">Cycle de vente ⇾</div>
         </div>
         <div className="bg-secondary p-8 rounded-[40px] flex flex-col justify-between shadow-xl shadow-secondary/10 relative overflow-hidden group italic">
            <Zap size={100} className="absolute -right-6 -bottom-6 text-primary/5 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
               <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-4 italic tracking-tighter">Taux de Devis</h3>
               <p className="text-2xl font-black text-primary italic">{Math.round((stats.quoted / stats.total) * 100) || 0}%</p>
            </div>
         </div>
      </div>

      <div className="bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-primary/5 shadow-inner">
         <AdminSourcingTable requests={requests} />
      </div>
    </div>
  )
}
