'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ChevronRight, 
  Clock, 
  Zap,
  Boxes,
  MapPin,
  Archive,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface UserSourcingListProps {
  requests: {
    id: string
    title: string | null
    type: string
    targetCountry: string | null
    createdAt: Date | string
    budget: number | null
    status: string
  }[]
}

export function UserSourcingList({ requests }: UserSourcingListProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {requests.map((req) => (
          <Link 
            key={req.id} 
            href={`/dashboard/buyer/sourcing/${req.id}`}
            className="group block bg-white rounded-[40px] p-8 border border-primary/5 hover:border-secondary/50 shadow-sm transition-all hover:shadow-xl hover:shadow-secondary/5 relative overflow-hidden italic"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-20 translate-x-4 group-hover:translate-x-0 transition-all">
               <ChevronRight size={48} className="text-secondary" />
            </div>

            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center text-primary group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                  {req.type === 'B2B' ? <Boxes size={24} /> : <Zap size={24} />}
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">#{req.id.slice(0, 8)}</div>
                  <Badge variant="outline" className="text-[9px] font-black uppercase rounded-full border-slate-100 bg-slate-50/50 text-slate-400 italic">
                     {req.type === 'B2B' ? 'Achat Grossiste' : 'Buy For Me'}
                  </Badge>
               </div>
            </div>

            <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-4 italic line-clamp-1 group-hover:text-secondary transition-colors">
              {req.title || 'Demande Sourcing'}
            </h3>

            <div className="space-y-4 mb-8">
               <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground italic tracking-widest">
                  <div className="flex items-center gap-2 italic uppercase"><MapPin size={14} className="text-secondary opacity-60" /> {req.targetCountry || 'International'}</div>
                  <div className="flex items-center gap-2 italic uppercase"><Clock size={14} className="text-secondary opacity-60" /> {format(new Date(req.createdAt), 'dd MMM yyyy', { locale: fr })}</div>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-primary/5">
               <div className="italic">
                  <div className="text-[9px] font-black text-muted-foreground uppercase mb-1 italic tracking-widest italic tracking-tighter">Budget Indicatif</div>
                  <div className="text-sm font-black text-primary italic">$ {req.budget ? req.budget.toLocaleString('en-US') : '---'}</div>
               </div>
               <div className="text-right italic">
                  <div className="text-[9px] font-black text-muted-foreground uppercase mb-1 italic">Statut Dossier</div>
                  <div className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    req.status === 'QUOTED' ? "text-secondary animate-pulse" : "text-primary opacity-60"
                  )}>
                    {req.status === 'QUOTED' ? 'Devis Reçu' : req.status.replace(/_/g, ' ')}
                  </div>
               </div>
            </div>
          </Link>
        ))}

        {requests.length === 0 && (
          <div className="col-span-full py-32 text-center italic bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-100">
             <Archive size={64} className="mx-auto text-slate-200 mb-6" />
             <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] px-12">Vous n&apos;avez pas encore de demandes de sourcing en cours.</p>
          </div>
        )}
      </div>
    </div>
  )
}
