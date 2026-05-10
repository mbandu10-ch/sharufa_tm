'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Store, 
  FileText, 
  CreditCard, 
  PlusCircle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface OnboardingChecklistProps {
  shopId: string
  hasLegalProfile: boolean
  documentCount: number
  productCount: number
  hasLogo: boolean
}

export function OnboardingChecklist({ 
  hasLegalProfile, 
  documentCount, 
  productCount, 
  hasLogo 
}: OnboardingChecklistProps) {
  
  const steps = [
    {
      id: 'profile',
      title: 'Identité de la Boutique',
      description: 'Ajoutez votre logo et votre bannière.',
      completed: hasLogo,
      link: '/dashboard/settings'
    },
    {
      id: 'legal',
      title: 'Informations Légales & Bancaires',
      description: 'IBAN, Raison sociale et coordonnées.',
      completed: hasLegalProfile,
      link: '/dashboard/compliance'
    },
    {
      id: 'docs',
      title: 'Documents de Vérification',
      description: 'Téléchargez vos pièces justificatives.',
      completed: documentCount > 0,
      link: '/dashboard/compliance'
    },
    {
      id: 'products',
      title: 'Premier Produit',
      description: 'Mettez votre premier article en vente.',
      completed: productCount > 0,
      link: '/dashboard/products/new'
    }
  ]

  const completedCount = steps.filter(s => s.completed).length
  const percentage = Math.round((completedCount / steps.length) * 100)

  if (percentage === 100) return null

  return (
    <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-slate-200 rounded-[40px] p-8 md:p-10 shadow-2xl shadow-primary/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-[10px]">
              <Sparkles size={14} />
              <span>Configuration de votre espace</span>
            </div>
            <h3 className="text-3xl font-black font-outfit text-primary tracking-tighter">
              Complétez votre boutique <span className="text-secondary italic">({percentage}%)</span>
            </h3>
            <p className="text-muted-foreground font-medium max-w-xl">
              Plus votre profil est complet, plus vite notre équipe pourra valider votre boutique et lancer vos ventes.
            </p>
          </div>
          
          <div className="w-24 h-24 rounded-full border-[6px] border-slate-100 flex items-center justify-center relative shadow-inner">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="48" cy="48" r="42" 
                  fill="none" stroke="currentColor" strokeWidth="6"
                  className="text-secondary transition-all duration-1000 ease-out"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * percentage) / 100}
                />
             </svg>
             <span className="text-xl font-black font-outfit text-primary">{percentage}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <Link key={step.id} href={step.link}>
              <div className={cn(
                "group h-full p-6 rounded-3xl border transition-all duration-300 flex flex-col gap-4",
                step.completed 
                  ? "bg-emerald-50/50 border-emerald-100" 
                  : "bg-white border-slate-100 hover:border-secondary hover:shadow-lg hover:shadow-secondary/5 hover:-translate-y-1"
              )}>
                <div className="flex items-center justify-between">
                   <div className={cn(
                     "w-10 h-10 rounded-2xl flex items-center justify-center",
                     step.completed ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary"
                   )}>
                     {step.id === 'profile' && <Store size={20} />}
                     {step.id === 'legal' && <CreditCard size={20} />}
                     {step.id === 'docs' && <FileText size={20} />}
                     {step.id === 'products' && <PlusCircle size={20} />}
                   </div>
                   {step.completed ? (
                     <CheckCircle2 className="text-emerald-500" size={20} />
                   ) : (
                     <Circle className="text-slate-200 group-hover:text-secondary" size={20} />
                   )}
                </div>
                <div className="space-y-1">
                   <h4 className={cn("text-sm font-black uppercase tracking-wider", step.completed ? "text-emerald-900" : "text-primary")}>
                      {step.title}
                   </h4>
                   <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {step.description}
                   </p>
                </div>
                {!step.completed && (
                  <div className="mt-auto pt-2 flex items-center text-[10px] font-black uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    Compléter <ArrowRight className="ml-1" size={12} />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
