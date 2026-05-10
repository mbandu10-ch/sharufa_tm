import React from 'react'
import { prisma } from '@sharufa/db'
import { ShopListTable } from '@/components/admin/compliance/ShopListTable'
import { Store } from 'lucide-react'
import Link from 'next/link'

export default async function AdminShopsPage() {
  const shops = await prisma.shop.findMany({
    include: {
      owner: true,
      legalProfile: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-secondary mb-2">
              <Store size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pilotage de l'Ecosystème</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tighter">Boutiques Partenaires</h1>
           <p className="text-muted-foreground font-medium mt-2 max-w-xl italic">
             Gérez l'ensemble des vendeurs de la marketplace : visibilité, catalogue, profil public et accès propriétaire.
           </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm">
              <div className="text-2xl font-black text-primary leading-none mb-1">{shops.length}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Boutiques Total</div>
           </div>
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center">
              <div className="text-2xl font-black text-secondary leading-none mb-1">
                 {shops.reduce((acc, s) => acc + (s._count?.products || 0), 0)}
              </div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Articles Publiés</div>
           </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-primary/5">
         <ShopListTable shops={shops} />
      </div>

      <div className="bg-primary text-white rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="max-w-md">
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Ajouter un nouveau partenaire ?</h3>
            <p className="text-white/60 text-sm font-medium">Vous pouvez forcer l'inscription d'une boutique manuellement ou inviter un vendeur par e-mail.</p>
         </div>
         <Link 
            href="/admin/shops/new" 
            className="bg-secondary text-primary px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/10"
         >
            Inviter un Vendeur
         </Link>
      </div>
    </div>
  )
}
