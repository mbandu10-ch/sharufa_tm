'use client'

import React from 'react'
import { Card } from '@sharufa/ui/components/card'
import { Badge } from '@sharufa/ui/components/badge'
import { 
  Search,
  Clock, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SourcingRequest {
  id: string
  title: string | null
  description: string
  status: string
  createdAt: Date
}

interface MobileSourcingCardProps {
  request: SourcingRequest
  href: string
}

export function MobileSourcingCard({ request, href }: MobileSourcingCardProps) {
  const statusConfig: Record<string, { label: string, color: string }> = {
    NEW: { label: 'Nouveau', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    UNDER_REVIEW: { label: 'Examen', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    QUOTED: { label: 'Devis reçu', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    ACCEPTED: { label: 'Accepté', color: 'text-green-600 bg-green-50 border-green-100' },
    COMPLETED: { label: 'Terminé', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    REJECTED: { label: 'Refusé', color: 'text-red-600 bg-red-50 border-red-100' },
  }

  const status = statusConfig[request.status] || statusConfig.NEW

  return (
    <Link href={href}>
      <Card className="p-5 border-none shadow-sm bg-white rounded-2xl active:scale-[0.98] transition-transform">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package size={20} />
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border",
            status.color
          )}>
            {status.label}
          </div>
        </div>
        
        <div className="space-y-1 mb-4">
          <h4 className="font-bold text-primary text-sm line-clamp-1">
            {request.title || 'Demande sans titre'}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {request.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <span className="text-[10px] text-muted-foreground font-medium">
            {new Date(request.createdAt).toLocaleDateString('fr-FR')}
          </span>
          <div className="flex items-center gap-1 text-blue-600 font-black text-[11px] uppercase tracking-tighter">
            Suivre
            <ChevronRight size={14} />
          </div>
        </div>
      </Card>
    </Link>
  )
}
