import React from 'react'
import { prisma } from '@sharufa/db'
import { notFound } from 'next/navigation'
import { AdminOrderDetail } from '@/components/admin/orders/AdminOrderDetail'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      client: true,
      shop: true,
      items: {
        include: {
          product: true
        }
      },
      events: {
        orderBy: { createdAt: 'desc' }
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' },
        include: { changedBy: true }
      }
    }
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/orders" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 italic">Retour aux commandes</div>
             <h1 className="text-xl font-black text-primary uppercase tracking-tight italic flex items-center gap-2">
                <ShoppingBag size={18} className="text-secondary" /> Pilotage du flux transactionnel
             </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-6 py-3 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-primary italic border-2 border-white shadow-sm">
              Source: {order.sourceType}
           </div>
        </div>
      </div>

      <AdminOrderDetail order={order} events={order.events} statusHistory={order.statusHistory} />
    </div>
  )
}
