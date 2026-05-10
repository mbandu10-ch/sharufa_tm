import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { 
  ShoppingBag, 
  Clock,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { getBuyerStatusLabel } from '@/lib/order-status-config'

export default async function BuyerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user's own orders as a buyer
  const orders = await prisma.order.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true
    }
  })

  const ongoingOrders = orders.filter(o => ['NEW', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED'].includes(o.status) && o.logisticsStatus !== 'DELIVERED')
  const pastOrders = orders.filter(o => o.logisticsStatus === 'DELIVERED' || o.status === 'CANCELLED')

  return (
    <div className="space-y-16 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter uppercase italic">Mes Achats</h1>
            <p className="text-muted-foreground font-medium italic">Suivez vos importations et l&apos;historique de vos commandes.</p>
         </div>
      </div>

      {/* Ongoing Orders */}
      <div className="space-y-8">
         <div className="flex items-center gap-3">
            <Clock size={24} className="text-amber-500" />
            <h2 className="text-xl font-black text-primary uppercase tracking-tight italic">Commandes en cours</h2>
         </div>

         {ongoingOrders.length === 0 ? (
            <Card className="border-none shadow-sm bg-white rounded-[40px] p-12 text-center border border-slate-100">
               <p className="text-muted-foreground font-medium italic">Aucune commande en cours.</p>
            </Card>
         ) : (
            <div className="grid grid-cols-1 gap-6">
               {ongoingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
               ))}
            </div>
         )}
      </div>

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <ShoppingBag size={24} className="text-slate-400" />
              <h2 className="text-xl font-black text-primary uppercase tracking-tight italic">Historique des commandes</h2>
           </div>

           <div className="grid grid-cols-1 gap-6">
              {pastOrders.map((order) => (
                 <OrderCard key={order.id} order={order} />
              ))}
           </div>
        </div>
      )}
    </div>
  )
}

function OrderCard({ order }: { order: any }) {
  const statusLabel = getBuyerStatusLabel(order.logisticsStatus)
  const itemsCount = order.items.length
  return (
     <Card className="border-none shadow-sm bg-white rounded-[40px] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary font-black italic shadow-inner">
                 #{order.orderNumber.slice(-4)}
              </div>
              <div className="space-y-1">
                 <div className="text-xs font-black text-primary/40 uppercase tracking-widest italic">{format(new Date(order.createdAt), "dd MMMM yyyy", { locale: fr })}</div>
                 <div className="text-lg font-black text-primary uppercase tracking-tight italic">Commande #{order.orderNumber}</div>
                 <div className="text-xs font-bold text-slate-500 italic">{itemsCount} article{itemsCount > 1 ? 's' : ''} • {order.totalAmount.toLocaleString()} {order.currency}</div>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className={cn(
                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic border",
                order.logisticsStatus === 'DELIVERED' ? "bg-green-50 text-green-600 border-green-100" : "bg-secondary/10 border-secondary/20 text-primary"
              )}>
                 {statusLabel}
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                 <Button asChild variant="outline" className="flex-1 md:flex-none rounded-2xl h-12 border-slate-100 font-bold uppercase text-[10px] tracking-widest italic">
                    <Link href={`/dashboard/buyer/orders/${order.id}`}>Détails</Link>
                 </Button>
                 <Button asChild className="flex-1 md:flex-none rounded-2xl h-12 bg-primary text-white font-bold uppercase text-[10px] tracking-widest italic shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <Link href={`/dashboard/buyer/orders/${order.id}`}>Tracking <ArrowRight size={14} className="ml-1" /></Link>
                 </Button>
              </div>
           </div>
        </div>
     </Card>
  )
}
