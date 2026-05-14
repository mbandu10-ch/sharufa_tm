'use client'

import React from 'react'
import { Button } from '@sharufa/ui/components/button'
import { Link } from '@/lib/i18n-navigation'
import { ArrowRight, Globe, ShieldCheck, Truck } from 'lucide-react'

export function MarketplaceHero() {
  return (
    <section className="relative overflow-hidden bg-primary py-12 md:py-20 lg:py-28 text-white">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 skew-x-12 transform translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-secondary/5 -skew-x-12 transform -translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <ShieldCheck size={16} className="text-secondary" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest italic">Expérience Premium Vérifiée</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-outfit leading-tight tracking-tight uppercase italic">
            Achetez auprès de <br className="hidden md:block" />
            <span className="text-secondary">boutiques vérifiées</span> <br className="hidden md:block" />
            à Dubaï, Turquie & Chine
          </h1>
          
          <p className="text-sm md:text-xl text-white/70 max-w-2xl font-medium leading-relaxed">
            Produits, sourcing, logistique et livraison vers l’Afrique avec Sharufa. 
            Le pont direct entre les marchés mondiaux et votre entreprise.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button className="w-full sm:w-auto bg-secondary text-primary font-black px-10 py-6 rounded-2xl hover:bg-white transition-all text-base shadow-xl group uppercase tracking-widest italic">
              Démarrer vos achats
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="flex items-center gap-6 text-white/60">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Globe size={14} className="text-secondary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Sourcing Global</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Truck size={14} className="text-secondary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Livraison Afrique</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
