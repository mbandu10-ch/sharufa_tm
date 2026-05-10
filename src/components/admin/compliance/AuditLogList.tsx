'use client'

import React from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ShieldCheck, 
  User, 
  Clock,
  AlertTriangle,
  Landmark,
  Wallet,
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuditLogListProps {
  events: any[]
}

export function AuditLogList({ events }: AuditLogListProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT_VERIFIED':
      case 'APPROVED': return <CheckCircle2 size={14} className="text-green-500" />
      
      case 'DOCUMENT_REJECTED':
      case 'REJECTED': return <XCircle size={14} className="text-red-500" />
      
      case 'DOCUMENT_UPLOADED':
      case 'PRODUCT_SUBMITTED': return <FileText size={14} className="text-secondary" />
      
      case 'SHOP_VERIFICATION_UPDATED':
      case 'STATUS_UPDATED': return <ShieldCheck size={14} className="text-primary" />
      
      case 'LEGAL_PROFILE_UPDATED':
      case 'PRODUCT_CORRECTED': return <User size={14} className="text-slate-400" />
      
      case 'NEEDS_CORRECTION': return <AlertTriangle size={14} className="text-amber-500" />
      
      case 'ENTRY_CREATED':
      case 'PAYMENT_RECEIVED': return <DollarSign size={14} className="text-green-500" />
      
      case 'PAYMENT_MARKED_AS_PAID':
      case 'STATUS_UPDATED': return <Landmark size={14} className="text-secondary" />
      
      case 'PAYMENT_BLOCKED':
      case 'ON_HOLD': return <XCircle size={14} className="text-red-500" />
      
      case 'ELIGIBILITY_CHECKED': return <ShieldCheck size={14} className="text-primary" />
      
      default: return <Clock size={14} className="text-slate-400" />
    }
  }

  if (events.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Aucun historique disponible</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
         <History size={18} className="text-primary" />
         <h3 className="text-sm font-black uppercase tracking-widest text-primary">Historique de Conformité</h3>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
        {events.map((event, index) => (
          <div key={event.id} className="relative group">
            <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10 group-hover:border-primary transition-colors">
              {getEventIcon(event.eventType)}
            </div>
            
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
               <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                    {event.eventType.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400">
                    {format(new Date(event.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                  </div>
               </div>
               <p className="text-sm font-bold text-primary leading-relaxed">{event.message}</p>
               {event.adminId && (
                 <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-1.5">
                    Admin ID: <span className="text-primary opacity-60">#{event.adminId.slice(0, 8)}</span>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
