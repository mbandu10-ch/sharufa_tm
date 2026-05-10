'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ShoppingBag, Package, Truck, ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-32 h-32 bg-secondary/10 rounded-full flex items-center justify-center mx-auto text-secondary shadow-2xl shadow-secondary/20"
        >
          <CheckCircle2 size={64} />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black font-outfit text-primary tracking-tighter uppercase">
            Commande <br/><span className="text-secondary italic">Confirmée !</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-lg mx-auto">
            Merci pour votre confiance. Votre demande a été transmise à notre équipe logistique.
          </p>
        </div>

        <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[48px] inline-block">
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Numéro de Commande</p>
          <p className="text-3xl font-black text-primary font-mono">{orderNumber || 'SH-ORDER'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 bg-white rounded-[40px] border border-slate-100 space-y-4 shadow-sm hover:shadow-xl transition-all">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Package size={20} />
            </div>
            <h3 className="font-black text-primary">Préparation</h3>
            <p className="text-xs text-muted-foreground font-medium">Nos experts vérifient la conformité de vos produits sous 24/48h.</p>
          </div>
          <div className="p-8 bg-white rounded-[40px] border border-slate-100 space-y-4 shadow-sm hover:shadow-xl transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Truck size={20} />
            </div>
            <h3 className="font-black text-primary">Expédition</h3>
            <p className="text-xs text-muted-foreground font-medium">Nous organisons le transport optimal vers votre destination finale.</p>
          </div>
          <div className="p-8 bg-white rounded-[40px] border border-slate-100 space-y-4 shadow-sm hover:shadow-xl transition-all">
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Zap size={20} />
            </div>
            <h3 className="font-black text-primary">Suivi</h3>
            <p className="text-xs text-muted-foreground font-medium">Un conseiller Sharufa vous contactera pour les détails logistiques.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link href="/dashboard/orders">
            <Button className="h-16 px-10 rounded-full bg-primary text-white font-black text-lg uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
              Gérer ma commande
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" className="h-16 px-10 rounded-full border-2 border-slate-100 font-black text-lg uppercase tracking-widest hover:bg-slate-50 transition-all flex gap-2">
              <ShoppingBag size={20} /> Retour Boutique
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={48} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)
