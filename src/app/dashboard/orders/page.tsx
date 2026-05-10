import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Calendar,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch shop
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  let shop = profile?.shop
  if (!shop && profile?.role === 'ADMIN') {
    shop = await prisma.shop.findUnique({ where: { slug: 'sharufa-store' } })
  }

  const isSellerView = !!shop
  let orders: any[] = []
  let sellerOrderItems: any[] = []

  if (isSellerView) {
    // Fetch orders involving this shop's products
    sellerOrderItems = await prisma.orderItem.findMany({
      where: { product: { shopId: shop!.id } },
      orderBy: { order: { createdAt: 'desc' } },
      include: {
        order: {
          include: {
            client: { select: { firstName: true, lastName: true, email: true } }
          }
        }
      }
    })

    // Deduplicate orders
    orders = Array.from(new Set(sellerOrderItems.map(item => item.order.id)))
      .map(id => sellerOrderItems.find(item => item.order.id === id)!.order)
  } else {
    // Fetch user's own orders as a buyer
    orders = await prisma.order.findMany({
      where: { clientId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { include: { shop: { select: { name: true } } } }
          }
        }
      }
    })
  }

  const statusConfig: Record<string, { label: string, icon: any, color: string }> = {
    NEW: { label: 'Nouveau', icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    CONFIRMED: { label: 'Confirmé', icon: CheckCircle2, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    PROCESSING: { label: 'Traitement', icon: ShoppingBag, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    SHIPPED: { label: 'Expédié', icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    DELIVERED: { label: 'Livré', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    CANCELLED: { label: 'Annulé', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100' },
    ISSUE: { label: 'Litige', icon: Filter, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter">
              {isSellerView ? 'Mes Ventes' : 'Mes Achats'}
            </h1>
            <p className="text-muted-foreground font-medium">
              {isSellerView ? 'Gérez vos ventes et expéditions.' : 'Suivez vos commandes passées sur Sharufa.'}
            </p>
         </div>

         <Button variant="outline" className="rounded-full border-2 border-slate-100 px-6 h-14 font-bold text-primary hover:bg-slate-50">
            <Download className="mr-2" size={18} /> Exporter
         </Button>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {isSellerView ? 'Client' : 'Boutique(s)'}
                     </th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Articles</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Statut</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {orders.length === 0 ? (
                     <tr>
                        <td colSpan={7} className="px-8 py-20 text-center">
                           <div className="flex flex-col items-center space-y-4">
                              <ShoppingBag size={48} className="text-slate-200" />
                              <p className="text-muted-foreground font-medium">Aucune commande trouvée.</p>
                           </div>
                        </td>
                     </tr>
                  ) : (
                     orders.map((order) => {
                        const status = statusConfig[order.status] || { label: order.status, icon: Clock, color: 'text-slate-600 bg-slate-50 border-slate-100' }
                        
                        let itemsCount = 0
                        let displayName = ''

                        if (isSellerView) {
                           itemsCount = sellerOrderItems.filter(i => i.orderId === order.id).length
                           displayName = `${order.client.firstName} ${order.client.lastName}`
                        } else {
                           itemsCount = order.items?.length || 0
                           // Get unique shop names from items
                           const shops = Array.from(new Set(order.items?.map((i: any) => i.product?.shop?.name))).filter(Boolean)
                           displayName = shops.length > 0 ? (shops.length > 1 ? `${shops[0]} +${shops.length - 1}` : shops[0] as string) : 'Sharufa'
                        }

                        return (
                           <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                              <td className="px-8 py-4">
                                 <span className="text-xs font-bold text-primary font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    #{order.id.slice(-6).toUpperCase()}
                                 </span>
                              </td>
                              <td className="px-8 py-4">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-black text-primary truncate max-w-[150px]">
                                      {displayName}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-8 py-4 text-xs font-medium text-muted-foreground">
                                 {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-8 py-4">
                                 <span className="text-xs font-bold text-slate-600">{itemsCount} articles</span>
                              </td>
                              <td className="px-8 py-4">
                                 <span className="text-sm font-black text-primary">{order.totalAmount.toLocaleString()} CFA</span>
                              </td>
                              <td className="px-8 py-4">
                                 <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border",
                                    status.color
                                 )}>
                                     <status.icon size={12} />
                                     {status.label}
                                 </div>
                              </td>
                              <td className="px-8 py-4 text-right">
                                 <Link 
                                   href={`/dashboard/orders/${order.id}`}
                                   className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-primary transition-colors inline-block"
                                 >
                                    <Eye size={20} />
                                 </Link>
                              </td>
                           </tr>
                        )
                     })
                  )}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  )
}

