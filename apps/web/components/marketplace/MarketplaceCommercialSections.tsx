'use client'

import React from 'react'
import { Link } from '@/lib/i18n-navigation'
import { Sparkles, Globe, ShieldCheck, Box, Zap, TrendingUp, Handshake, PackageCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const commercialBlocks = [
  { id: 'turkey', title: 'Nouveautés Turquie', icon: Sparkles, color: 'bg-red-50 text-red-600', desc: 'Arrivages hebdomadaires d\'Istanbul.' },
  { id: 'uae', title: 'Produits UAE', icon: Globe, color: 'bg-blue-50 text-blue-600', desc: 'Le meilleur de Dubaï à prix direct.' },
  { id: 'verified', title: 'Boutiques vérifiées', icon: ShieldCheck, color: 'bg-green-50 text-green-600', desc: 'Vendeurs contrôlés par Sharufa.' },
  { id: 'ondemand', title: 'Sur demande', icon: Box, color: 'bg-purple-50 text-purple-600', desc: 'Produits spécifiques sur commande.' },
  { id: 'ready', title: 'Prêt à expédier', icon: Zap, color: 'bg-orange-50 text-orange-600', desc: 'Stock disponible immédiatement.' },
  { id: 'trends', title: 'Tendances', icon: TrendingUp, color: 'bg-pink-50 text-pink-600', desc: 'Les produits viraux du moment.' },
  { id: 'deals', title: 'Meilleures offres', icon: PackageCheck, color: 'bg-yellow-50 text-yellow-600', desc: 'Promotions et déstockages.' },
  { id: 'sourcing', title: 'Achat sur demande', icon: Handshake, color: 'bg-indigo-50 text-indigo-600', desc: 'Nous sourçons pour vous.' },
]

export function MarketplaceCommercialSections() {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {commercialBlocks.map((block) => {
            const Icon = block.icon
            return (
              <Link 
                key={block.id}
                href="/marketplace"
                className="group bg-white p-6 rounded-[32px] border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", block.color)}>
                  <Icon size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-primary">
                    {block.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed">
                    {block.desc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
