import React from 'react'
import { prisma } from '@sharufa/db'
import { notFound } from 'next/navigation'
import { ShopDetailView } from '@/components/admin/compliance/ShopDetailView'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AdminShopDetailPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      owner: true,
      legalProfile: true,
      documents: {
        orderBy: { createdAt: 'desc' }
      },
      complianceEvents: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!shop) {
    notFound()
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/compliance" 
          className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
           <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Retour à la liste</div>
           <h1 className="text-xl font-black text-primary uppercase tracking-tight">Dossier de Conformité : {shop.name}</h1>
        </div>
      </div>

      <ShopDetailView shop={shop} />
    </div>
  )
}
