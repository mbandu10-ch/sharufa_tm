'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mail, AlertTriangle, Home, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function RejectedStatusView() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 md:p-16 rounded-[60px] shadow-2xl shadow-red-500/5 border border-red-50 border-t-4 border-t-red-500"
      >
        <div className="space-y-10">
          <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
             <AlertTriangle size={48} />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-outfit font-black text-primary leading-tight">
              Demande <span className="text-red-500">non retenue</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Nous avons examiné votre demande d&apos;ouverture de boutique. Malheureusement, elle ne correspond pas à nos critères actuels de partenariat.
            </p>
          </div>

          <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 text-left">
             <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <MessageCircle size={18} /> Note de l&apos;équipe :
             </h4>
             <p className="text-sm text-red-800 leading-relaxed italic">
                &quot;Votre catalogue produit doit être plus complet et respecter nos standards de qualité visuelle. N&apos;hésitez pas à nous re-contacter une fois ces points améliorés.&quot;
             </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
               href="/"
               className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
             >
               <Home size={20} /> Retour Accueil
             </Link>
             <Link 
               href="/contact"
               className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-primary rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
             >
               <Mail size={20} /> Discuter avec nous
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
