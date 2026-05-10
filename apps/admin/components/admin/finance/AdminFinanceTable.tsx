'use client'

import React from 'react'
import Link from 'next/link'
import { 
  DollarSign, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Landmark,
  ArrowRight,
  TrendingUp,
  Receipt,
  Store,
  Wallet
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AdminFinanceTableProps {
  vendors: any[]
}

export function AdminFinanceTable({ vendors }: AdminFinanceTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">Payé</Badge>
      case 'ELIGIBLE':
        return <Badge className="bg-secondary text-primary border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg shadow-secondary/20 animate-pulse">Éligible</Badge>
      case 'ON_HOLD':
        return <Badge className="bg-red-100 text-red-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">En pause</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">En attente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <h2 className="text-xl font-black text-primary uppercase tracking-tighter italic flex items-center gap-3">
           <Landmark size={24} className="text-secondary" /> Grand Livre des Vendeurs
        </h2>

        {/* Search */}
        <div className="relative flex-grow max-w-sm">
          <input 
            type="text"
            placeholder="Rechercher une boutique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-primary/5 rounded-full pl-8 pr-8 py-3.5 text-xs font-bold text-primary focus:ring-2 focus:ring-secondary/50 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/[0.02] border-b border-primary/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Boutique</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Ventes Totales</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Commissions (14%)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">À Payer (Net)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Conformité RIB</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="group hover:bg-primary/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary font-black text-xs">
                          {vendor.name[0]}
                       </div>
                       <div>
                          <div className="font-black text-primary uppercase text-sm">{vendor.name}</div>
                          <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{vendor.country || 'International'}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-primary italic">
                       {vendor.totalSales.toLocaleString()} <span className="text-[10px] font-bold opacity-40">$</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-red-400 text-xs italic">
                    - $ {vendor.totalCommission.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-green-600 italic">
                       {vendor.netToPay.toLocaleString()} $
                    </div>
                    <div className="mt-1">
                       {getStatusBadge(vendor.status)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {vendor.hasValidRib ? (
                      <Badge className="bg-green-50 text-green-600 border-green-100 rounded-full text-[9px] font-black uppercase px-3 italic">
                         <ShieldCheck size={10} className="mr-1" /> Validé
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-400 border-red-100 rounded-full text-[9px] font-black uppercase px-3 italic">
                         <AlertTriangle size={10} className="mr-1" /> Manquant
                      </Badge>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/finance/${vendor.id}`}
                      className="inline-flex items-center gap-2 bg-slate-50 group-hover:bg-primary group-hover:text-white text-muted-foreground px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      Gérer <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredVendors.length === 0 && (
            <div className="py-24 text-center italic">
               <Wallet size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
               <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs px-12">Aucun historique financier pour cette boutique.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
