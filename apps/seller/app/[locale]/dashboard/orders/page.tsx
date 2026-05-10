import React from 'react'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@sharufa/db'
import { Card } from '@sharufa/ui/components/card'
import { 
  ShoppingBag, 
  Clock,
  Eye,
  Truck,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@sharufa/ui/components/button'
import { cn } from '@sharufa/shared'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { LogisticsActionButton } from '@root/components/dashboard/LogisticsActionButton'

export default async function SellerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch shop
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  const shop = profile?.shop
  if (!shop && profile?.role !== 'ADMIN') {
     redirect('/dashboard/buyer/orders')
  }

  // Fetch orders involving this shop's products
  const sellerOrderItems = await prisma.orderItem.findMany({
    where: { 
        product: { 
            shopId: shop?.id || (profile?.role === 'ADMIN' ? { not: '' } : '') 
        } 
    },
    orderBy: { order: { createdAt: 'desc' } },
    include: {
      order: {
        include: {
          items: true
        }
      }
    }
  })

  // Deduplicate orders
  const orders = Array.from(new Set(sellerOrderItems.map(item => item.order.id)))
    .map(id => sellerOrderItems.find(item => item.order.id === id)!.order)

  const logisticsStatusMapping: Record<string, { label: string, color: string, icon?: any }> = {
    NEW_ORDER: { label: 'À expédier', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Clock },
    DROPPED_AT_CARGO: { label: 'Envoyé au cargo', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Truck },
    RECEIVED_BY_CARGO: { label: 'Reçu par cargo', color: 'text-emerald-700 bg-emerald-100 border-emerald-200', icon: ShoppingBag },
    REJECTED_BY_CARGO: { label: 'Non-conforme', color: 'text-rose-600 bg-rose-50 border-rose-100', icon: AlertTriangle },
    SHIPPED: { label: 'En transit', color: 'text-purple-600 bg-purple-50 border-purple-100', icon: Truck },
    DELIVERED: { label: 'Livré', color: 'text-green-700 bg-green-100 border-green-200', icon: ShoppingBag },
  }

  return (
    <div className="space-y-12 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter uppercase italic">Mes Ventes</h1>
            <p className="text-muted-foreground font-medium italic">Gérez vos commandes et expéditions.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {orders.length === 0 ? (
            <Card className="border-none shadow-sm bg-white rounded-[40px] p-20 text-center">
               <div className="flex flex-col items-center space-y-4">
                  <ShoppingBag size={48} className="text-slate-200" />
                  <p className="text-muted-foreground font-medium italic">Aucune vente enregistrée pour le moment.</p>
               </div>
            </Card>
         ) : (
            orders.map((order) => {
               const status = logisticsStatusMapping[order.logisticsStatus] || { label: order.logisticsStatus, color: 'text-slate-600 bg-slate-50 border-slate-100' }
               const itemsCount = order.items.length
               return (
                  <Card key={order.id} className="border-none shadow-sm bg-white rounded-[40px] overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                     <div className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary font-black italic shadow-inner">
                              #{order.orderNumber.slice(-4)}
                           </div>
                           <div className="space-y-1">
                              <div className="text-xs font-black text-primary/40 uppercase tracking-widest italic">{format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}</div>
                              <div className="text-lg font-black text-primary uppercase tracking-tight italic">Commande #{order.orderNumber}</div>
                              <div className="text-xs font-bold text-slate-500 italic">{itemsCount} article{itemsCount > 1 ? 's' : ''} • {order.totalAmount.toLocaleString()} {order.currency}</div>
                           </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                           <div className={cn(
                              "px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2",
                              status.color
                           )}>
                              {status.icon && <status.icon size={12} />}
                              {status.label}
                           </div>
                           
                           <div className="flex gap-2 w-full md:w-auto min-w-[200px]">
                              <LogisticsActionButton 
                                orderId={order.id} 
                                currentStatus={order.logisticsStatus} 
                              />
                              <Button asChild variant="outline" className="w-12 h-10 rounded-xl border-slate-100 text-slate-400 hover:text-primary transition-all">
                                 <Link href={`/dashboard/orders/${order.id}`}>
                                    <Eye size={18} />
                                 </Link>
                              </Button>
                           </div>
                        </div>
                     </div>
                  </Card>
               )
            })
         )}
      </div>
    </div>
  )
}
