'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    toast.success("Votre message a été envoyé avec succès !")
    ;(e.target as HTMLFormElement).reset()
  }

  const offices = [
    {
      city: "Dubaï, EAU",
      address: "Deira Business Center, Office 402",
      phone: "+971 50 516 8219",
      email: "dubai@sharufa.com",
      flag: "🇦🇪"
    },
    {
      city: "Istanbul, Turquie",
      address: "Merter, Mehmet Akif Ersoy Cd. No:12",
      phone: "+90 544 357 6295",
      email: "turkey@sharufa.com",
      flag: "🇹🇷"
    },
    {
      city: "Guangzhou, Chine",
      address: "Yuexiu District, Zhanqian Rd No. 193",
      phone: "+86 000 0000 0000",
      email: "china@sharufa.com",
      flag: "🇨🇳"
    }
  ]

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/10 text-secondary font-black text-xs uppercase tracking-[0.2em]"
            >
              <Globe className="w-4 h-4" /> Global Presence
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-outfit font-black text-primary uppercase tracking-tighter leading-[0.8]"
            >
              Parlons <span className="text-secondary italic">Business.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
            >
              Une question, un partenariat ou un sourcing spécifique ? Nos experts internationaux vous répondent sous 24h.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 md:p-16 rounded-[64px] border border-border shadow-2xl space-y-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-primary font-outfit uppercase tracking-tighter">Envoyez un message</h2>
                <p className="text-muted-foreground">Nous aimons les nouveaux défis.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-4">Nom complet</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Jean Dupont" 
                      className="w-full px-8 py-5 rounded-[24px] border border-border focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-4">Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="jean@exemple.com" 
                      className="w-full px-8 py-5 rounded-[24px] border border-border focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary ml-4">Sujet</label>
                  <select className="w-full px-8 py-5 rounded-[24px] border border-border focus:ring-4 focus:ring-secondary/20 outline-none transition-all bg-transparent">
                    <option>Sourcing (Buy For Me)</option>
                    <option>Devenir Vendeur</option>
                    <option>Suivi de commande</option>
                    <option>Partenariat logistique</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary ml-4">Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Comment pouvons-nous vous aider ?" 
                    className="w-full px-8 py-5 rounded-[32px] border border-border focus:ring-4 focus:ring-secondary/20 outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-6 bg-primary text-secondary font-black rounded-[32px] uppercase tracking-[0.2em] shadow-xl hover:bg-secondary hover:text-primary transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? "Envoi en cours..." : (
                    <>
                      Envoyer le message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Info & Offices */}
            <div className="space-y-12">
              {/* Quick Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.a 
                  href="https://wa.me/971000000000"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-emerald-500 rounded-[48px] text-white space-y-4 hover:scale-105 transition-transform shadow-lg group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl uppercase font-outfit">WhatsApp</h3>
                    <p className="text-white/80 text-sm">Discutez en direct avec nos agents logistiques.</p>
                  </div>
                </motion.a>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-8 bg-white border border-border rounded-[48px] space-y-4 shadow-sm"
                >
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl uppercase font-outfit text-primary">Réponse 24h</h3>
                    <p className="text-muted-foreground text-sm">Nous garantissons une réponse rapide à vos emails.</p>
                  </div>
                </motion.div>
              </div>

              {/* Offices List */}
              <div className="space-y-8">
                <h2 className="text-2xl font-black text-primary font-outfit uppercase tracking-wider ml-2">Nos Bureaux Internationaux</h2>
                <div className="space-y-4">
                  {offices.map((office, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="p-6 bg-white border border-border rounded-[32px] flex items-center gap-6 group hover:translate-x-2 transition-transform"
                    >
                      <div className="text-4xl">{office.flag}</div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-primary text-xl flex items-center gap-2">
                          {office.city}
                        </h4>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-secondary" /> {office.address}</span>
                          <span className="flex items-center gap-2"><Phone className="w-3 h-3 text-secondary" /> {office.phone}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
