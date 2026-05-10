import React from 'react'
import { prisma } from '@sharufa/db'
import { AdminProductTable } from '@/components/admin/products/AdminProductTable'
import { Package, ArrowLeft, Filter, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      shop: true,
      category: true,
      originCountry: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  // Statistiques du catalogue
  const summary = {
    total: products.length,
    underReview: products.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length,
    approved: products.filter(p => p.status === 'APPROVED').length,
    outOfStock: products.filter(p => p.stock === 0).length
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-secondary mb-2">
              <Package size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Qualité du Catalogue</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tighter">Gestion des Produits</h1>
           <p className="text-muted-foreground font-medium mt-2 max-w-xl italic">
             Approuvez les nouveaux arrivages, gérez les stocks critiques et assurez la cohérence du catalogue global de Sharufa.
           </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center">
              <div className="text-2xl font-black text-primary leading-none mb-1">{summary.underReview}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic">A Examiner</div>
           </div>
           <div className="bg-white px-8 py-5 rounded-[24px] border border-primary/5 shadow-sm text-center">
              <div className="text-2xl font-black text-secondary leading-none mb-1">{summary.total}</div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic">Articles Total</div>
           </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-primary/5 shadow-inner">
         <AdminProductTable products={products} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-[#002B24] rounded-[40px] p-10 flex items-center justify-between group overflow-hidden relative shadow-xl shadow-primary/10">
            <TrendingUp size={120} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 max-w-xs">
               <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 italic">Analyse des Tendances</h3>
               <p className="text-white/40 text-sm font-medium mb-6 leading-relaxed">Découvrez les produits les plus consultés et optimisez l'approvisionnement.</p>
               <Link href="/admin/sourcing" className="text-secondary text-[10px] font-black uppercase tracking-widest hover:underline">Explorer le Sourcing ⇾</Link>
            </div>
         </div>
         <div className="bg-white border border-primary/5 rounded-[40px] p-10 flex flex-col justify-center">
            <h3 className="text-lg font-black text-primary uppercase tracking-tight mb-4 italic flex items-center gap-2">
               <Filter size={18} className="text-secondary" /> Tri Multi-Critères
            </h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              Utilisez les filtres avancés pour trier le catalogue par pays d'origine, par type de boutique ou par volume de stock disponible.
            </p>
         </div>
      </div>
    </div>
  )
}
