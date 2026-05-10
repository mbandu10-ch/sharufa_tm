import React from 'react'
import { prisma } from '@sharufa/db'
import { notFound } from 'next/navigation'
import { VendorFinanceDetail } from '@/components/admin/finance/VendorFinanceDetail'
import { ArrowLeft, Landmark } from 'lucide-react'
import Link from 'next/link'

export default async function VendorFinanceDetailPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params
  
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      documents: {
        where: { type: 'RIB', verificationStatus: 'VERIFIED' }
      },
      financialTransactions: {
        include: {
          order: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      financialEvents: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!shop) {
    notFound()
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/finance" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 italic">Retour aux finances</div>
             <h1 className="text-xl font-black text-primary uppercase tracking-tight italic flex items-center gap-2">
                <Landmark size={18} className="text-secondary" /> Grand Livre : {shop.name}
             </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-6 py-3 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-primary italic border-2 border-white shadow-sm">
              ID Vendeur: {shop.id.slice(0, 8)}...
           </div>
        </div>
      </div>

      <VendorFinanceDetail 
        shop={shop} 
        transactions={shop.financialTransactions} 
        events={shop.financialEvents} 
      />
    </div>
  )
}
