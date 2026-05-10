'use client'

import React from 'react'
import { Card } from '@sharufa/ui/components/card'
import { Badge } from '@sharufa/ui/components/badge'
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Eye,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { getBuyerStatusLabel } from '@/lib/order-status-config'
import { LogisticsStatus } from '@prisma/client'

interface Order {
  id: string
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

interface MobileOrderCardProps {
  order: Order
  href: string
}

export function MobileOrderCard({ order, href }: MobileOrderCardProps) {
  const statusConfig: Record<string, { label: string, icon: any, color: string }> = {
    NEW_ORDER: { label: 'En préparation', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    DROPPED_AT_CARGO: { label: 'En préparation', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    RECEIVED_BY_CARGO: { label: 'Livré au cargo', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    SHIPPED: { label: 'Expédié', icon: Truck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    IN_TRANSIT: { label: 'En transit', icon: Truck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    DELIVERED: { label: 'Livré', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    CANCELLED: { label: 'Annulé', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100' },
  }

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
    <Link href={href}>
      <Card className="p-6 border-none shadow-sm bg-white rounded-[32px] active:scale-[0.98] transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-outfit">
              #{order.id.slice(-6).toUpperCase()}
            </span>
            <h4 className="text-sm font-black text-primary uppercase italic mt-1 line-clamp-1 max-w-[180px]">
               {productNames || 'Détails commande'}
            </h4>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm shrink-0",
            status.color
          )}>
            <status.icon size={10} strokeWidth={3} />
            {status.label}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total</p>
            <p className="text-xl font-black text-primary font-outfit">
              ${(order.totalAmount || 0).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-widest">
            Détails
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center shadow-inner">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
