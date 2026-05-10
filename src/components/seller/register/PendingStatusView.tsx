'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, PhoneCall, Mail, Home } from 'lucide-react'
import Link from 'next/link'

export default function PendingStatusView() {
  const steps = [
    {
      title: "Vérification du profil",
      desc: "Notre équipe examine vos informations et vos documents sous 24h.",
      icon: <Clock className="w-6 h-6" />,
      status: "current"
    },
    {
      title: "Entretien rapide",
      desc: "Un conseiller Sharufa peut vous contacter pour valider votre catalogue.",
      icon: <PhoneCall className="w-6 h-6" />,
      status: "upcoming"
    },
    {
      title: "Mise en ligne",
      desc: "Votre boutique devient visible et vous pouvez ajouter vos produits.",
      icon: <CheckCircle2 className="w-6 h-6" />,
      status: "upcoming"
    }
  ]

  return (
    <div className="max-w-3xl mx-auto text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 md:p-16 rounded-[60px] shadow-2xl shadow-primary/5 border border-slate-100 relative overflow-hidden"
      >
        {/* Animated Background Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-10">
          <div className="w-24 h-24 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
             <Clock size={48} strokeWidth={2.5} />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary leading-tight">
              Demande en cours de <span className="text-secondary italic">validation</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
              Félicitations ! Votre demande d&apos;ouverture de boutique a bien été reçue. Nous traitons les dossiers par ordre d&apos;arrivée.
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="grid grid-cols-1 gap-6 text-left max-w-md mx-auto">
             {steps.map((step, i) => (
                <div key={i} className={`flex gap-6 p-6 rounded-3xl border transition-all ${
                  step.status === 'current' ? 'bg-slate-50 border-secondary/30 ring-4 ring-secondary/5' : 'bg-white border-slate-100 opacity-50'
                }`}>
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                     step.status === 'current' ? 'bg-secondary text-primary' : 'bg-slate-100 text-slate-400'
                   }`}>
                      {step.icon}
                   </div>
                   <div className="space-y-1">
                      <h4 className="font-bold text-primary">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-snug">{step.desc}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
               href="/"
               className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
             >
               <Home size={20} /> Retour à l&apos;accueil
             </Link>
             <Link 
               href="/contact"
               className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-primary rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
             >
               <Mail size={20} /> Contacter le support
             </Link>
          </div>
        </div>
      </motion.div>

      <p className="mt-12 text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
         <Shield size={16} className="text-secondary" /> Navigation sécurisée par Sharufa Support
      </p>
    </div>
  )
}

function Shield({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
