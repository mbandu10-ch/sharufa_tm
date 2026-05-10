'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
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
  PackageCheck,
  Zap,
  Boxes,
  MapPin,
  Calendar,
  Layers,
  Archive,
  ArrowRight
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AdminSourcingTableProps {
  requests: any[]
}

export function AdminSourcingTable({ requests }: AdminSourcingTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('ALL')

  const filteredRequests = requests.filter(req => {
    const matchesSearch = (req.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (req.client?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (req.client?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    if (statusFilter === 'ALL') return matchesSearch
    return matchesSearch && req.status === statusFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic">Terminé</Badge>
      case 'QUOTED':
        return <Badge className="bg-secondary text-primary border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic animate-pulse shadow-lg shadow-secondary/20">Devis Envoyé</Badge>
      case 'IN_PROGRESS':
      case 'UNDER_REVIEW':
        return <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic">En cours</Badge>
      case 'NEEDS_INFO':
        return <Badge className="bg-amber-100 text-amber-500 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic tracking-tighter italic">Besoin d'infos</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic">Refusé</Badge>
      case 'NEW':
        return <Badge className="bg-slate-100 text-slate-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic">Nouveau</Badge>
      case 'ACCEPTED':
        return <Badge className="bg-green-500 text-white border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic">Validé</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest italic">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'B2B':
        return <Badge className="bg-primary text-white border-none rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest"><Boxes size={10} className="mr-1" /> B2B Sourcing</Badge>
      case 'BUY_FOR_ME':
      default:
        return <Badge className="bg-slate-100 text-muted-foreground border-none rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest"><Zap size={10} className="mr-1" /> Buy For Me</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        {/* Rapid Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          {['ALL', 'NEW', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                statusFilter === f 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                  : "bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary border border-primary/5 shadow-sm"
              )}
            >
              {f === 'ALL' ? 'Tous' : f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-grow max-w-sm">
          <input 
            type="text"
            placeholder="Titre, client, pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-primary/5 rounded-full pl-8 pr-8 py-3.5 text-xs font-bold text-primary focus:ring-2 focus:ring-secondary/50 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/[0.02] border-b border-primary/5 italic uppercase tracking-[0.2em] text-muted-foreground text-[10px]">
                <th className="px-8 py-6 font-black">Demande & Type</th>
                <th className="px-8 py-6 font-black">Client / Origine</th>
                <th className="px-8 py-6 font-black">Budget / Qté</th>
                <th className="px-8 py-6 font-black text-center">Statut</th>
                <th className="px-8 py-6 font-black text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="group hover:bg-primary/[0.01] transition-colors italic">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Archive size={20} className="opacity-40" />
                       </div>
                       <div>
                          <div className="font-black text-primary uppercase text-sm mb-1">{req.title || 'Demande Sourcing'}</div>
                          {getTypeBadge(req.type)}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5 text-xs font-bold text-primary italic">
                       <div className="flex items-center gap-2">
                          <User size={12} className="text-secondary" />
                          <span className="truncate max-w-[150px]">{req.client.firstName} {req.client.lastName}</span>
                       </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin size={12} className="opacity-50" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{req.targetCountry || 'Tous Pays'}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-primary italic">
                       {req.budget ? req.budget.toLocaleString() : '---'} <span className="text-[10px] font-bold opacity-60">CFA</span>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1 italic tracking-widest">
                       {req.requestedQuantity} unité(s)
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center italic">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="px-8 py-6 text-right italic">
                    <Link 
                      href={`/admin/sourcing/${req.id}`}
                      className="inline-flex items-center gap-2 bg-slate-50 group-hover:bg-primary group-hover:text-white text-muted-foreground px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      Devis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRequests.length === 0 && (
            <div className="py-24 text-center italic tracking-widest p-12">
               <Briefcase size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
               <p className="text-muted-foreground font-bold uppercase text-xs">Aucune demande de sourcing pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
