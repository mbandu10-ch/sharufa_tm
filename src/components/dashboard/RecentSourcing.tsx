'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Boxes,
  Eye,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SourcingRequest {
  id: string
  title: string | null
  type: string
  status: string
  createdAt: Date
  targetCountry: string | null
}

interface RecentSourcingProps {
  requests: SourcingRequest[]
}

export function RecentSourcing({ requests }: RecentSourcingProps) {
  const statusConfig: Record<string, { label: string, color: string }> = {
    PENDING: { label: 'En attente', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    QUOTED: { label: 'Devis Reçu', color: 'text-secondary bg-secondary/10 border-secondary/20' },
    PROCESSING: { label: 'Traitement', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    COMPLETED: { label: 'Terminé', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    CANCELLED: { label: 'Annulé', color: 'text-red-600 bg-red-50 border-red-100' },
  }

  return (
    <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black font-outfit text-primary uppercase tracking-tight">Demandes de Sourcing</h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">Vos dernières recherches "Buy For Me"</p>
        </div>
        <Link 
          href="/dashboard/buyer/sourcing"
          className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline"
        >
          Voir tout
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Titre / Objet</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Origine</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Statut</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-muted-foreground font-medium text-sm">
                   Aucune demande de sourcing pour le moment.
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const status = statusConfig[req.status] || statusConfig.PENDING
                return (
                  <tr key={req.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-4">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                          {req.type === 'B2B' ? <Boxes size={16} /> : <Zap size={16} />}
                       </div>
                    </td>
                    <td className="px-8 py-4">
                       <span className="text-sm font-bold text-primary truncate max-w-[200px] block">
                         {req.title || 'Demande Sourcing'}
                       </span>
                    </td>
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          <MapPin size={12} className="text-secondary opacity-60" />
                          {req.targetCountry || 'Global'}
                       </div>
                    </td>
                    <td className="px-8 py-4 text-xs font-medium text-muted-foreground">
                       <DateDisplay date={req.createdAt} />
                    </td>
                    <td className="px-8 py-4">
                       <div className={cn(
                         "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border",
                         status.color
                       )}>
                          {status.label}
                       </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                       <Link 
                         href={`/dashboard/buyer/sourcing/${req.id}`}
                         className="p-2 hover:bg-secondary/10 rounded-xl inline-flex text-secondary transition-colors"
                       >
                          <Eye size={18} />
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
