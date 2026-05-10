'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Eye,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getBuyerStatusLabel } from '@/lib/order-status-config'
import { LogisticsStatus } from '@prisma/client'


interface Order {
  id: string
  orderNumber?: string
  totalAmount: number
  status: string
  logisticsStatus: LogisticsStatus
  createdAt: Date
  items: {
    product: {
      name: string
    }
    selectedSize?: string
    selectedColor?: string
  }[]
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const pathname = usePathname()
  const isSeller = pathname?.startsWith('/dashboard/seller')
  const baseHref = isSeller ? '/dashboard/seller/orders' : '/dashboard/buyer/orders'

  const statusConfig: Record<string, { label: string, icon: any, color: string }> = {
    NEW_ORDER: { label: 'En préparation', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    DROPPED_AT_CARGO: { label: 'En préparation', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    RECEIVED_BY_CARGO: { label: 'Livré au cargo', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    SHIPPED: { label: 'Expédié', icon: Truck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    IN_TRANSIT: { label: 'En transit', icon: Truck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    DELIVERED: { label: 'Livré', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    CANCELLED: { label: 'Annulé', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100' },
  }

  return (
    <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black font-outfit text-primary uppercase tracking-tight italic">Dernières Commandes</h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">Vos transactions les plus récentes</p>
        </div>
        <Link 
          href={baseHref}
          className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline flex items-center gap-1"
        >
          Voir tout <ArrowRight size={12} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID Commande</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Articles</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Date</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Total</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground font-medium text-sm italic">
                   Aucune commande trouvée pour le moment.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = statusConfig[order.logisticsStatus] || { 
                   label: getBuyerStatusLabel(order.logisticsStatus), 
                   icon: Clock, 
                   color: 'text-amber-600 bg-amber-50 border-amber-100' 
                }
                const productNames = order.items.map(i => {
                  let name = i.product.name
                  if (i.selectedSize || i.selectedColor) {
                    name += ` (${[i.selectedSize, i.selectedColor].filter(Boolean).join(', ')})`
                  }
                  return name
                }).join(', ')

                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/30 transition-colors group cursor-pointer" 
                    onClick={() => window.location.href = `${baseHref}/${order.id}`}
                  >
                    <td className="px-8 py-6">
                       <span className="text-xs font-black text-primary font-outfit bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                         #{order.id.slice(-6).toUpperCase()}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-primary truncate max-w-[250px] uppercase italic">
                            {productNames || 'Détails de la commande'}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                             {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-muted-foreground text-center italic">
                       <DateDisplay date={order.createdAt} />
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-primary text-center">
                       ${(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex justify-center">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                            status.color
                          )}>
                             <status.icon size={10} strokeWidth={3} />
                             {status.label}
                          </div>
                       </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function DateDisplay({ date }: { date: Date | string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  
  if (!mounted) return <span className="opacity-0">...</span>
  
  return (
    <span>
      {new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })}
    </span>
  )
}
