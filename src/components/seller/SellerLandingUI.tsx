'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Globe, 
  Truck, 
  ShieldCheck, 
  BarChart3, 
  Store, 
  CheckCircle2, 
  Briefcase, 
  TrendingUp, 
  Users,
  Zap,
  Clock,
  LayoutDashboard
} from 'lucide-react'
import Link from 'next/link'

interface SellerLandingUIProps {
  shopStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED'
}

export default function SellerLandingUI({ shopStatus }: SellerLandingUIProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const sections = [
    {
      title: "Fournisseurs & Fabricants",
      desc: "Écoulez vos stocks en gros (B2B) auprès d'une clientèle internationale. Idéal pour les usines et entrepôts en Turquie, Chine et Dubaï.",
      icon: <Briefcase className="w-8 h-8" />,
      tag: "WHOLESALE"
    },
    {
      title: "Boutiques Locales",
      desc: "Digitalisez votre point de vente physique et touchez des clients au-delà de votre ville. Augmentez votre visibilité instantanément.",
      icon: <Store className="w-8 h-8" />,
      tag: "RETAIL"
    },
    {
      title: "Entrepreneurs & Revendeurs",
      desc: "Lancez votre marque propre sans vous soucier de la logistique. Nous gérons l'infrastructure, vous gérez la croissance.",
      icon: <Zap className="w-8 h-8" />,
      tag: "GROWTH"
    }
  ]

  const benefits = [
    {
      title: "Logistique de A à Z",
      desc: "Du ramassage en entrepôt au dédouanement et à la livraison finale par nos partenaires locaux.",
      icon: <Truck />
    },
    {
      title: "Portée Internationale",
      desc: "Vos produits sont visibles simultanément en Afrique, au Moyen-Orient et en Europe.",
      icon: <Globe />
    },
    {
      title: "Paiements Sécurisés",
      desc: "Recevez vos fonds en toute sécurité via nos passerelles de paiement partenaires (Banque, Mobile Money, Crypto).",
      icon: <ShieldCheck />
    },
    {
      title: "Analitiques Avancées",
      desc: "Suivez vos performances, vos stocks et vos tendances de vente en temps réel sur votre dashboard.",
      icon: <BarChart3 />
    }
  ]

  const steps = [
    { title: "Inscription", desc: "Remplissez le formulaire et envoyez vos justificatifs en 2 minutes." },
    { title: "Validation", desc: "Notre équipe vérifie votre identité et vos produits sous 48h." },
    { title: "Ventes", desc: "Mettez en ligne vos articles et commencez à recevoir des commandes." }
  ]

  const renderCTA = () => {
    if (shopStatus === 'APPROVED') {
      return (
        <Link 
          href="/dashboard"
          className="w-full sm:w-auto px-12 py-6 bg-secondary text-primary rounded-full font-black text-xl shadow-2xl shadow-secondary/20 hover:scale-105 transition-transform flex items-center justify-center gap-3"
        >
          Accéder à mon Dashboard <LayoutDashboard />
        </Link>
      )
    }

    if (shopStatus === 'PENDING') {
       return (
        <Link 
          href="/seller/register"
          className="w-full sm:w-auto px-12 py-6 bg-secondary text-primary rounded-full font-black text-xl shadow-2xl shadow-secondary/20 hover:scale-105 transition-transform flex items-center justify-center gap-3"
        >
          Suivre ma demande <Clock className="animate-spin-slow" />
        </Link>
       )
    }

    return (
      <Link 
        href="/seller/register"
        className="w-full sm:w-auto px-12 py-6 bg-secondary text-primary rounded-full font-black text-xl shadow-2xl shadow-secondary/20 hover:scale-105 transition-transform flex items-center justify-center gap-3"
      >
        Commencer maintenant <ArrowRight />
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-white selection:bg-secondary selection:text-primary">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div {...fadeInUp}>
             <div className="inline-block mb-6 bg-secondary text-primary border-none font-black px-6 py-2 rounded-full uppercase tracking-widest text-xs">
                Devenez Partenaire Sharufa
             </div>
             <h1 className="text-5xl md:text-8xl font-outfit font-black text-white leading-none tracking-tighter mb-8">
               Vendez là où le <span className="text-secondary italic">monde</span> achète
             </h1>
             <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-12">
               Accédez à des clients internationaux et développez votre activité sans contraintes logistiques. Nous gérons tout, de l&apos;entrepôt à la livraison.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {renderCTA()}
                <Link 
                  href="#how-it-works"
                  className="w-full sm:w-auto px-12 py-6 bg-white/10 text-white border border-white/20 rounded-full font-bold text-xl hover:bg-white/20 transition-all"
                >
                  Voir comment ça marche
                </Link>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Segmentation Section */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tight">Une place pour chaque talent</h2>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">Que vous soyez un grand fabricant ou un commerçant local, Sharufa est votre accélérateur de croissance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white p-10 rounded-[48px] border border-slate-200 hover:border-secondary hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 bg-slate-50 rounded-bl-[48px] group-hover:bg-secondary/10 transition-colors">
                   <div className="text-slate-300 group-hover:text-secondary">{section.icon}</div>
                </div>
                <div className="mt-8 space-y-6">
                   <span className="text-[10px] font-black tracking-widest text-secondary bg-secondary/5 px-4 py-1.5 rounded-full border border-secondary/10">
                      {section.tag}
                   </span>
                   <h3 className="text-2xl font-black text-primary leading-tight">{section.title}</h3>
                   <p className="text-muted-foreground leading-relaxed font-medium">{section.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Proof / Stats Bar */}
      <section className="py-16 bg-white border-y">
         <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-around items-center gap-12">
               {[
                 { label: "Clients Actifs", value: "10K+", icon: <Users size={20} /> },
                 { label: "Pays Desservis", value: "15+", icon: <Globe size={20} /> },
                 { label: "Vendeurs Vérifiés", value: "500+", icon: <Store size={20} /> },
                 { label: "Volume de Vente", value: "$2M+", icon: <TrendingUp size={20} /> }
               ].map((stat, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                       {stat.icon}
                    </div>
                    <div>
                       <div className="text-3xl font-outfit font-black text-primary leading-none mb-1">{stat.value}</div>
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. Benefits Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
               <div className="space-y-4 text-left">
                  <h2 className="text-4xl md:text-5xl font-outfit font-black text-primary leading-none uppercase tracking-tight">Pourquoi choisir <span className="text-secondary italic">Sharufa</span> ?</h2>
                  <p className="text-muted-foreground text-lg font-medium">Nous avons construit l&apos;infrastructure pour que vous puissiez vous concentrer sur ce que vous faites de mieux : créer et sourcer des produits exceptionnels.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="space-y-4">
                       <div className="w-12 h-12 rounded-2xl bg-primary text-secondary flex items-center justify-center shadow-lg">
                          {React.cloneElement(benefit.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                       </div>
                       <h4 className="text-lg font-bold text-primary">{benefit.title}</h4>
                       <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-[60px] overflow-hidden bg-primary shadow-2xl flex items-center justify-center group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary/20" />
               <div className="relative z-10 p-12 text-center space-y-8 max-w-md">
                   <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 mb-6">
                      <Truck className="w-16 h-16 text-secondary animate-pulse" />
                   </div>
                   <h3 className="text-3xl font-outfit font-black text-white leading-tight">Dubaï • Turquie • Chine • Afrique</h3>
                   <p className="text-white/60 font-medium leading-relaxed">
                     Notre réseau logistique exclusif connecte les pôles mondiaux de production directement aux marchés émergents.
                   </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How it Works (Steps) */}
      <section id="how-it-works" className="py-24 md:py-32 bg-slate-50 rounded-[80px] md:rounded-[120px] mx-4 md:mx-0">
        <div className="container mx-auto px-4">
           <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tight">Devenir Vendeur en 3 Etapes</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-px border-t-2 border-dashed border-slate-200 -z-10" />
              
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-6">
                   <div className="w-24 h-24 rounded-[40px] bg-white border-4 border-slate-50 flex items-center justify-center text-3xl font-black text-primary shadow-xl relative group-hover:scale-110 transition-transform">
                      <div className="absolute inset-0 bg-secondary/10 rounded-[36px] scale-0 group-hover:scale-100 transition-transform" />
                      {i+1}
                   </div>
                   <div className="space-y-3">
                      <h4 className="text-2xl font-black text-primary">{step.title}</h4>
                      <p className="text-muted-foreground font-medium max-w-[250px]">{step.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4">
           <div className="bg-primary p-12 md:p-24 rounded-[60px] md:rounded-[100px] text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                 <h2 className="text-4xl md:text-7xl font-outfit font-black text-white tracking-tighter leading-none">
                    Prêt à booster votre <span className="text-secondary italic">activité</span> ?
                 </h2>
                 <p className="text-xl text-white/50 font-medium">Rejoignez des centaines de vendeurs qui font confiance à Sharufa pour leur développement international.</p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    {renderCTA()}
                 </div>
                 <p className="text-white/30 text-sm font-bold uppercase tracking-widest mt-12 flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Approbation garantie sous 48H
                 </p>
              </div>
           </div>
        </div>
      </section>

    </div>
  )
}
