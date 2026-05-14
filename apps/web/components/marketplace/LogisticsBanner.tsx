'use client'

import React from 'react'
import { Button } from '@sharufa/ui/components/button'
import { ArrowRight, Truck } from 'lucide-react'

export function LogisticsBanner() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-primary rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden group shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="space-y-6 text-center lg:text-left max-w-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-secondary mx-auto lg:mx-0">
                <Truck size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black font-outfit leading-tight tracking-tight uppercase italic">
                Expédiez vos achats <br className="hidden md:block" />
                vers <span className="text-secondary">l’Afrique</span> avec Sharufa
              </h2>
              <p className="text-sm md:text-lg text-white/60 font-medium">
                Logistique intégrée, groupage de colis et suivi en temps réel. 
                De nos hubs mondiaux à votre destination finale.
              </p>
            </div>
            
            <div className="shrink-0 w-full lg:w-auto">
               <Button className="w-full lg:w-auto bg-secondary text-primary font-black px-12 py-8 rounded-2xl hover:bg-white transition-all text-lg shadow-2xl group uppercase tracking-widest italic">
                  Découvrir la logistique
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
               </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
