import React from 'react'
import { prisma } from '@sharufa/db'
import { notFound } from 'next/navigation'
import { AdminProductDetail } from '@/components/admin/products/AdminProductDetail'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function AdminProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      shop: true,
      category: true,
      originCountry: true,
      events: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Retour au catalogue</div>
             <h1 className="text-xl font-black text-primary uppercase tracking-tight italic">Examen Produit : {product.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <a 
              href={`/product/${product.slug}`} 
              target="_blank" 
              className="px-6 py-3 rounded-full border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:bg-primary/5 transition-all"
           >
              Voir la fiche publique <ExternalLink size={14} />
           </a>
        </div>
      </div>

      <AdminProductDetail product={product} events={product.events} />
    </div>
  )
}
