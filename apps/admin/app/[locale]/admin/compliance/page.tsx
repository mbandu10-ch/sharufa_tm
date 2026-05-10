import React from 'react'
import { prisma } from '@sharufa/db'
import { ShopListTable } from '@/components/admin/compliance/ShopListTable'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AdminCompliancePage() {
  const shops = await prisma.shop.findMany({
    include: {
      owner: true,
      legalProfile: true,
      documents: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  // Statistiques rapides
  const pendingCount = shops.filter(s => s.verificationStatus === 'SUBMITTED').length
  const verifiedCount = shops.filter(s => s.isVerified).length

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-secondary mb-2">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sécurité & Conformité</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tighter">Validation des Boutiques</h1>
           <p className="text-muted-foreground font-medium mt-2 max-w-xl italic">
             Vérifiez les documents légaux, validez les informations bancaires et attribuez le badge Verified aux partenaires certifiés Sharufa.
           </p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white px-8 py-4 rounded-[24px] border border-primary/5 shadow-sm text-center">
              <div className="text-2xl font-black text-primary">{pendingCount}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">En attente</div>
           </div>
           <div className="bg-white px-8 py-4 rounded-[24px] border border-primary/5 shadow-sm text-center">
              <div className="text-2xl font-black text-secondary">{verifiedCount}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Vérifiées</div>
           </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-primary/5">
         <ShopListTable shops={shops} />
      </div>

      <div className="flex justify-center pt-8">
         <Link 
            href="/admin" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
         >
            <ArrowLeft size={14} /> Retour au Dashboard
         </Link>
      </div>
    </div>
  )
}
