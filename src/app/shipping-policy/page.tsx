'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plane, Ship, Package, ShieldCheck, MapPin, Globe, Clock, ArrowRight } from 'lucide-react'

export default function ShippingPolicyPage() {
  const regions = [
    {
      country: "Dubaï, EAU",
      flag: "🇦🇪",
      air: "3-7 jours ouvrés",
      sea: "20-30 jours",
      frequency: "2 départs par semaine",
      description: "Notre hub principal pour l'électronique, la parfumerie et le luxe."
    },
    {
      country: "Istanbul, Turquie",
      flag: "🇹🇷",
      air: "5-10 jours ouvrés",
      sea: "15-25 jours",
      frequency: "Départ tous les vendredis",
      description: "Le centre d'excellence pour le textile, l'ameublement et l'agroalimentaire."
    },
    {
      country: "Guangzhou, Chine",
      flag: "🇨🇳",
      air: "10-15 jours ouvrés",
      sea: "35-45 jours",
      frequency: "Départ hebdomadaire",
      description: "Sourcing industriel, électronique de masse et gadgets innovants."
    }
  ]

  const steps = [
    {
      title: "Réception & Vérification",
      info: "Vos articles arrivent dans nos entrepôts locaux où nous vérifions la conformité et l'état.",
      icon: Package
    },
    {
      title: "Consolidation Premium",
      info: "Nous regroupons vos achats pour optimiser les coûts de transport et réduire le volume.",
      icon: ShieldCheck
    },
    {
      title: "Expédition Internationale",
      info: "Envoi via nos partenaires aériens ou maritimes avec gestion des formalités douanières.",
      icon: Plane
    },
    {
      title: "Livraison Locale",
      info: "Remise en main propre ou retrait en agence partenaire dans votre pays de destination.",
      icon: MapPin
    }
  ]

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/10 text-secondary font-black text-xs uppercase tracking-[0.2em]"
            >
              <Plane className="w-4 h-4 animate-bounce" /> Logistics Excellence
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-outfit font-black text-primary uppercase tracking-tighter leading-[0.8]"
            >
              Le Monde à votre <span className="text-secondary italic">Portée.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
            >
              De nos entrepôts internationaux à votre porte, découvrez comment nous sécurisons vos marchandises.
            </motion.p>
          </div>

          {/* Shipping Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-primary p-12 rounded-[64px] text-white flex flex-col justify-between space-y-12 relative overflow-hidden group border border-white/10"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />
              <div className="space-y-4 relative z-10">
                <div className="w-16 h-16 bg-secondary/20 rounded-3xl flex items-center justify-center">
                  <Plane className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">Fret Aérien</h2>
                <p className="text-primary-foreground/70 text-lg leading-relaxed">
                  Idéal pour les envois urgents, les produits de luxe et l'électronique. Rapidité et sécurité maximale.
                </p>
              </div>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest relative z-10">
                <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-secondary" /> Délais : Rapide</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-secondary" /> Sécurité : Maximale</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-12 rounded-[64px] border border-border flex flex-col justify-between space-y-12 relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />
              <div className="space-y-4 relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center">
                  <Ship className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-4xl font-black font-outfit text-primary uppercase tracking-tighter">Fret Maritime</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  La solution la plus économique pour vos gros volumes, conteneurs groupés ou machines industrielles.
                </p>
              </div>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-primary relative z-10">
                <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-secondary" /> Délais : Standard</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-secondary" /> Coût : Très Compétitif</li>
              </ul>
            </motion.div>
          </div>

          {/* Regional Table */}
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-primary font-outfit uppercase tracking-tighter text-center">Estimation par <span className="text-secondary italic">Destination</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {regions.map((region, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-10 rounded-[48px] border border-border space-y-6 hover:shadow-2xl transition-shadow"
                >
                  <div className="text-6xl">{region.flag}</div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black font-outfit text-primary">{region.country}</h3>
                    <p className="text-sm text-muted-foreground">{region.description}</p>
                  </div>
                  <div className="pt-6 border-t border-muted/20 space-y-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-secondary tracking-widest">Air (Express)</span>
                      <span className="text-lg font-bold text-primary">{region.air}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-secondary tracking-widest">Fréquence</span>
                      <span className="text-lg font-bold text-primary">{region.frequency}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tracking Step Process */}
          <div className="bg-muted p-12 md:p-20 rounded-[64px] space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-primary font-outfit uppercase tracking-tighter">Le Voyage de <span className="text-secondary italic">votre colis</span></h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Chaque étape est tracée et assurée par Sharufa.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {steps.map((step, idx) => (
                <div key={idx} className="space-y-6 relative overflow-visible">
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-[2.5rem] left-[60%] w-full h-[2px] bg-gradient-to-r from-secondary/50 to-transparent z-0" />
                  )}
                  <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto relative z-10 border border-secondary/20">
                    <step.icon className="w-10 h-10 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-primary italic text-xl">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-12 p-12 md:p-20 bg-secondary rounded-[64px] text-primary"
          >
            <div className="space-y-6 max-w-xl text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter leading-none">
                Besoin d'un <br/><span className="text-white">container complet ?</span>
              </h2>
              <p className="text-xl font-bold opacity-80 leading-snug">
                Pour les importateurs, nous gérons l'empotage complet et le transit maritime porte-à-porte.
              </p>
            </div>
            <a 
              href="/contact?subject=logistics"
              className="px-12 py-8 bg-primary text-secondary font-black rounded-full text-2xl shadow-2xl hover:bg-white hover:text-primary transition-all flex items-center gap-4 group"
            >
              Devis Logistique <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
