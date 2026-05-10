'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  ArrowRight, 
  DollarSign, 
  MapPin, 
  Clock, 
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Gift,
  Boxes
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface SourcingLead {
  id: string
  title: string | null
  description: string
  requestedQuantity: number
  targetCountry: string | null
  budget: number | null
  createdAt: Date
  category: { name: string } | null
}

interface SourcingLeadsFeedProps {
  leads: SourcingLead[]
  shopType: string
}

export function SourcingLeadsFeed({ leads, shopType }: SourcingLeadsFeedProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-white/50 border-2 border-dashed border-slate-100 rounded-[40px] p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <Boxes size={32} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-black font-outfit text-primary tracking-tighter uppercase">Aucun nouveau prospect</h4>
          <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
            Nous n&apos;avons pas trouvé de demandes de sourcing correspondant à votre spécialité pour le moment.
          </p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary bg-secondary/10 px-4 py-2 rounded-full inline-block">
          Activé pour {shopType}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center animate-pulse">
             <Zap size={16} />
           </div>
           <h3 className="text-2xl font-black font-outfit text-primary tracking-tighter uppercase italic">Opportunités de Vente</h3>
        </div>
        <Link href="/dashboard/sourcing" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline flex items-center gap-1">
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block p-6 bg-white border border-slate-100 rounded-[32px] hover:border-secondary hover:shadow-2xl hover:shadow-secondary/5 transition-all relative overflow-hidden"
          >
            {/* Lead Type Badge */}
            <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
              {lead.category?.name || 'Sourcing'}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-lg font-black font-outfit text-primary group-hover:text-secondary transition-colors line-clamp-1">
                  {lead.title || 'Demande sans titre'}
                </h4>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                  <Clock size={12} />
                  Posté {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: fr })}
                </p>
              </div>

              <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">
                {lead.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {lead.budget && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black italic shadow-sm border border-emerald-100">
                    <DollarSign size={12} /> {lead.budget.toLocaleString('en-US')} CFA
                  </div>
                )}
                {lead.targetCountry && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 rounded-xl text-xs font-bold border border-sky-100">
                    <MapPin size={12} /> {lead.targetCountry}
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-100">
                   {lead.requestedQuantity} unité(s)
                </div>
              </div>

              <Link 
                href={`/dashboard/sourcing/${lead.id}`}
                className="mt-6 w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group-hover:bg-secondary group-hover:text-primary transition-all shadow-xl shadow-slate-900/10"
              >
                Proposer un devis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
