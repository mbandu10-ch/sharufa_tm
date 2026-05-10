import React from 'react'
import { Settings, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AdminSettingsPlaceholder() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
      <div className="w-24 h-24 rounded-[40px] bg-primary/5 flex items-center justify-center text-primary shadow-xl shadow-primary/5 border border-primary/10 transition-transform hover:rotate-90 duration-700">
        <Settings size={40} className="animate-spin-slow" />
      </div>
      <div>
        <h1 className="text-4xl font-outfit font-black text-primary uppercase tracking-tighter mb-4">Configuration Système</h1>
        <p className="text-muted-foreground font-medium leading-relaxed italic">
          Paramétrez les frais de marketplace, les passerelles de paiement et les réglages globaux de la plateforme Sharufa. Contrôle total sur l'infrastructure.
        </p>
      </div>
      <div className="flex gap-4">
         <div className="bg-slate-900 px-8 py-4 rounded-3xl flex items-center gap-3">
            <ShieldCheck size={18} className="text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Gestion Critique</span>
         </div>
      </div>
      <Link href="/admin" className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
        Retour au Dashboard <ArrowRight size={14} />
      </Link>
    </div>
  )
}
