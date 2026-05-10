'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Landmark, Globe, ShieldCheck, Zap, Users, ArrowRight, Heart, BadgeCheck } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      title: "Transparence Totale",
      desc: "Aucun frais caché. Du sourcing à la livraison, vous connaissez le prix réel et la destination de votre investissement.",
      icon: ShieldCheck,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Vitesse d'Exécution",
      desc: "Dans le commerce, le temps c'est de l'argent. Nos réseaux logistiques sont optimisés pour les flux hebdomadaires.",
      icon: Zap,
      color: "bg-yellow-500/10 text-yellow-500"
    },
    {
      title: "Expertise Locale",
      desc: "Nos agents parlent la langue du business à Dubaï, Istanbul et Guangzhou pour négocier les meilleurs tarifs.",
      icon: Globe,
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      title: "Engagement Client",
      desc: "Chaque client est un partenaire. Nous ne vendons pas qu'un service, nous bâtissons votre succès commercial.",
      icon: Heart,
      color: "bg-rose-500/10 text-rose-500"
    }
  ]

  const stats = [
    { label: "Boutiques Partenaires", value: "250+", suffix: "+" },
    { label: "Colis Expédiés / Mois", value: "5000+", suffix: "+" },
    { label: "Villes de Destination", value: "45+", suffix: "+" },
    { label: "Experts sur le terrain", value: "15+", suffix: "+" }
  ]

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-32">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/10 text-secondary font-black text-xs uppercase tracking-[0.2em]"
              >
                <Landmark className="w-4 h-4" /> Notre Histoire & Vision
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-outfit font-black text-primary uppercase tracking-tighter leading-[0.8]"
              >
                Plus qu'un <span className="text-secondary italic">Pont.</span> <br />Une <span className="opacity-50">Ambition.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground leading-relaxed font-medium"
              >
                Sharufa est née d'un constat simple : l'accès aux hubs commerciaux mondiaux comme Dubaï, la Turquie et la Chine est semé d'obstacles pour les entrepreneurs africains et internationaux. 
                <br /><br />
                Nous avons bâti une infrastructure technologique et logistique pour éliminer les barrières géographiques et restaurer la confiance dans le commerce transfrontalier.
              </motion.p>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                {stats.map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="text-4xl font-black text-primary font-outfit">{stat.value}</div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-[80px] overflow-hidden shadow-2xl border-[16px] border-muted/20"
            >
              <img 
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000" 
                alt="Sharufa Team Hub" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12 text-white space-y-2">
                <BadgeCheck className="w-12 h-12 text-secondary" />
                <p className="text-2xl font-black font-outfit uppercase tracking-tighter">Excellence Certifiée</p>
                <p className="text-sm opacity-70">Opérations vérifiées sur 3 continents.</p>
              </div>
            </motion.div>
          </div>

          {/* Mission Section */}
          <div className="bg-muted/50 p-12 md:p-24 rounded-[80px] space-y-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
            
            <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-primary font-outfit uppercase tracking-tighter leading-none">
                Notre mission : <br/><span className="text-secondary italic">Démocratiser l'Import.</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Nous permettons à chaque individu ou entreprise, peu importe sa taille, d'acheter directement à la source, sans intermédiaires inutiles et avec une sécurité totale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-10 rounded-[48px] border border-border space-y-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 ${v.color} rounded-3xl flex items-center justify-center`}>
                    <v.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold font-outfit text-primary italic uppercase tracking-tighter">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Partners/Team Callout */}
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                   <div className="h-64 rounded-[40px] bg-secondary/20 flex items-center justify-center">
                     <Users className="w-16 h-16 text-secondary opacity-50" />
                   </div>
                   <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400" className="h-48 w-full object-cover rounded-[40px]" />
                </div>
                <div className="space-y-4 pt-12">
                   <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400" className="h-64 w-full object-cover rounded-[40px]" />
                   <div className="h-48 rounded-[40px] bg-primary/10 flex items-center justify-center">
                     <Landmark className="w-12 h-12 text-primary opacity-50" />
                   </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 space-y-8 order-1 lg:order-2">
              <h2 className="text-5xl md:text-7xl font-black text-primary font-outfit uppercase tracking-tighter leading-[0.8]">
                Rejoignez <br/><span className="text-secondary italic">la révolution.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium">
                Qu'il s'agisse de sourcer vos premières marchandises ou d'étendre votre catalogue actuel, Sharufa est le partenaire discret et efficace qui propulse votre croissance.
              </p>
              <div className="flex flex-col gap-4 pt-4">
                <a href="/seller/register" className="flex items-center justify-between p-6 bg-primary text-secondary rounded-[32px] hover:bg-secondary hover:text-primary transition-all group">
                   <span className="text-xl font-bold uppercase font-outfit tracking-wider">Devenir Vendeur</span>
                   <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </a>
                <a href="/marketplace" className="flex items-center justify-between p-6 border border-primary text-primary rounded-[32px] hover:bg-primary hover:text-white transition-all group">
                   <span className="text-xl font-bold uppercase font-outfit tracking-wider">Explorer la Marketplace</span>
                   <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          <div className="py-20 text-center space-y-8 border-t border-muted/50">
             <Landmark className="w-16 h-16 text-secondary mx-auto opacity-30" />
             <div className="space-y-2">
               <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Global Headquarters</p>
               <h3 className="text-2xl font-bold font-outfit text-primary font-outfit italic">Dubaï • Istanbul • Guangzhou • Afrique</h3>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
