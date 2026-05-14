'use client'

import React from 'react'
import { ShieldCheck, Globe, Truck } from 'lucide-react'

export function MarketplaceInfoBar() {
  return (
    <div className="bg-primary text-white py-3 border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-secondary/20 p-1.5 rounded-lg">
            <ShieldCheck size={16} className="text-secondary" />
          </div>
          <p className="text-[11px] md:text-sm font-medium tracking-tight">
            Achetez auprès de <span className="text-secondary font-black">boutiques vérifiées</span> à Dubaï, Turquie & Chine
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-secondary/60" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Sourcing Global</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-secondary/60" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Livraison Afrique</span>
          </div>
        </div>
      </div>
    </div>
  )
}
