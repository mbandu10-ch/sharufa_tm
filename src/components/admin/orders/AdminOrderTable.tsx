'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  User, 
  Store,
  CreditCard,
  Search,
  Filter,
  PackageCheck
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AdminOrderTableProps {
  orders: any[]
}

export function AdminOrderTable({ orders }: AdminOrderTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('ALL')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (statusFilter === 'ALL') return matchesSearch
    return matchesSearch && order.status === statusFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><CheckCircle2 size={12} className="mr-1.5" /> Livrée</Badge>
      case 'SHIPPED':
        return <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><Truck size={12} className="mr-1.5" /> Expédiée</Badge>
      case 'PROCESSING':
      case 'READY_TO_SHIP':
        return <Badge className="bg-orange-100 text-orange-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><Clock size={12} className="mr-1.5" /> En cours</Badge>
      case 'ISSUE':
        return <Badge className="bg-red-100 text-red-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><AlertTriangle size={12} className="mr-1.5" /> Problème</Badge>
      case 'NEW':
      case 'CONFIRMED':
        return <Badge className="bg-slate-100 text-slate-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">Nouvelle</Badge>
      case 'CANCELLED':
        return <Badge className="bg-slate-200 text-slate-500 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">Annulée</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="outline" className="border-green-200 text-green-600 rounded-full text-[9px] font-black uppercase px-3 py-1 bg-green-50/50">Payé</Badge>
      case 'PENDING':
        return <Badge variant="outline" className="border-orange-200 text-orange-600 rounded-full text-[9px] font-black uppercase px-3 py-1 bg-orange-50/50">Attente</Badge>
      case 'FAILED':
        return <Badge variant="outline" className="border-red-200 text-red-600 rounded-full text-[9px] font-black uppercase px-3 py-1 bg-red-50/50">Échec</Badge>
      default:
        return <Badge variant="outline" className="border-slate-200 text-slate-500 rounded-full text-[9px] font-black uppercase px-3 py-1">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        {/* Rapid Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {['ALL', 'NEW', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'ISSUE'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                statusFilter === f 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                  : "bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary border border-primary/5"
              )}
            >
              {f === 'ALL' ? 'Toutes' : f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text"
            placeholder="N° commande, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-primary/5 rounded-full pl-14 pr-8 py-3.5 text-xs font-bold text-primary focus:ring-2 focus:ring-secondary/50 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/[0.02] border-b border-primary/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Commande</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Client / Boutique</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Montant</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Paiement</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Statut</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-primary/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="font-black text-primary uppercase tracking-tighter text-sm mb-1">{order.orderNumber}</span>
                       <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5 text-xs font-bold text-primary">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-secondary" />
                          <span className="truncate max-w-[120px]">{order.client.firstName} {order.client.lastName}</span>
                       </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <Store size={12} className="opacity-50" />
                          <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">{order.shop?.name || 'Vente Directe'}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-primary">
                       {order.totalAmount.toLocaleString()} <span className="text-[10px] font-bold opacity-60 italic">{order.currency}</span>
                    </div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                       {order.items.length} article{order.items.length > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {getPaymentBadge(order.paymentStatus)}
                  </td>
                  <td className="px-8 py-6 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-2 bg-slate-50 group-hover:bg-primary group-hover:text-white text-muted-foreground px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      Gérer <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="py-24 text-center">
               <PackageCheck size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
               <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs px-12 italic">Aucune commande ne correspond à votre recherche pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
