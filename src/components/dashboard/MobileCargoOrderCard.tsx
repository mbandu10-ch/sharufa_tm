'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package,
  MapPin,
  ChevronRight,
  Truck,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CargoOrder {
  id: string
  orderNumber: string
  client: {
    firstName: string | null
    lastName: string | null
  }
  destinationCountry: string | null
  logisticsStatus: string
  createdAt: Date
  items: any[]
}

interface MobileCargoOrderCardProps {
  order: CargoOrder
}

export function MobileCargoOrderCard({ order }: MobileCargoOrderCardProps) {
  const isActionRequired = order.logisticsStatus === 'DROPPED_AT_CARGO'

  return (
    <Link href={`/cargo/orders/${order.id}`}>
      <Card className={cn(
        "p-5 border-none shadow-sm rounded-2xl active:scale-[0.98] transition-transform relative overflow-hidden",
        isActionRequired ? "bg-amber-50 ring-2 ring-amber-200" : "bg-white"
      )}>
        {isActionRequired && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-bl-xl">
            À traiter
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">
              #{order.orderNumber}
            </span>
            <h4 className="text-sm font-black text-primary uppercase leading-none">
              {order.client.firstName} {order.client.lastName}
            </h4>
          </div>
          
          <Badge variant="outline" className={cn(
            "rounded-full font-black uppercase text-[8px] tracking-widest py-1 px-3 border-none shadow-sm",
            order.logisticsStatus === 'DELIVERED' ? "bg-green-100 text-green-700" : 
            order.logisticsStatus === 'REJECTED_BY_CARGO' ? "bg-red-100 text-red-700" :
            isActionRequired ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
          )}>
            {(order.logisticsStatus || 'NEW').replace(/_/g, ' ')}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100/50">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Destination</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary italic">
              <MapPin size={10} className="text-secondary" />
              {order.destinationCountry}
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Items</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Package size={10} className="text-slate-400" />
              {order.items.length} positions
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
           <span className="text-[9px] text-muted-foreground font-bold italic">
             Reçu le {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: fr })}
           </span>
           <div className={cn(
             "flex items-center gap-1 font-black text-[10px] uppercase tracking-tighter",
             isActionRequired ? "text-amber-600" : "text-primary"
           )}>
             Détails suivi
             <ChevronRight size={14} />
           </div>
        </div>
      </Card>
    </Link>
  )
}
