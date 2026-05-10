'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Package, CreditCard, ShieldCheck, Zap } from 'lucide-react'

const faqs = [
  {
    category: "Général",
    icon: HelpCircle,
    questions: [
      {
        q: "Qu'est-ce que Sharufa.com ?",
        a: "Sharufa est une plateforme premium facilitant le commerce international. Nous connectons les acheteurs du monde entier (particulièrement en Afrique) aux meilleurs fournisseurs de Dubaï, Turquie et Chine, tout en gérant la logistique complexe pour vous."
      },
      {
        q: "Comment fonctionne la Marketplace ?",
        a: "Vous pouvez parcourir les produits de nos vendeurs vérifiés, les ajouter à votre panier et payer en ligne. Les vendeurs expédient ensuite vos produits vers nos centres logistiques pour consolidation et envoi final."
      }
    ]
  },
  {
    category: "Buy For Me (Sourcing)",
    icon: Zap,
    questions: [
      {
        q: "Comment utiliser le service 'Buy For Me' ?",
        a: "C'est simple : envoyez-nous une photo, un lien ou une description du produit que vous recherchez. Nos agents sur place (Dubaï, Istanbul, Guangzhou) trouvent le meilleur prix, négocient pour vous et gèrent l'achat."
      },
      {
        q: "Quels sont les frais pour le sourcing ?",
        a: "Nous appliquons une commission transparente basée sur la valeur de l'achat. Cela inclut la recherche, la vérification de la qualité et la négociation. Contactez-nous pour un devis personnalisé."
      }
    ]
  },
  {
    category: "Expédition & Logistique",
    icon: Package,
    questions: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "Les délais dépendent de l'origine : 3 à 7 jours ouvrés pour Dubaï, 5 à 10 jours pour la Turquie, et 10 à 15 jours pour la Chine par avion. Le fret maritime est également disponible pour les gros volumes."
      },
      {
        q: "Puis-je suivre mon colis ?",
        a: "Oui, chaque commande dispose d'un numéro de suivi unique accessible depuis votre tableau de bord Sharufa dès que le colis quitte notre entrepôt international."
      }
    ]
  },
  {
    category: "Paiements & Sécurité",
    icon: CreditCard,
    questions: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons les cartes bancaires internationales, le virement bancaire et, dans certains pays, les paiements par Mobile Money pour plus de flexibilité."
      },
      {
        q: "Mes paiements sont-ils sécurisés ?",
        a: "Absolument. Nous utilisons des protocoles de cryptage SSL de pointe et des processeurs de paiement certifiés PCI-DSS pour garantir la sécurité totale de vos transactions."
      }
    ]
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0")

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold text-sm uppercase tracking-widest"
            >
              <HelpCircle className="w-4 h-4" /> Centre d'aide
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-outfit font-black text-primary uppercase tracking-tighter"
            >
              Questions <span className="text-secondary italic">Fréquentes</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Tout ce que vous devez savoir sur la plateforme Sharufa pour réussir votre commerce international.
            </motion.p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-16">
            {faqs.map((section, sIdx) => (
              <div key={sIdx} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                  <section.icon className="w-6 h-6 text-secondary" />
                  <h2 className="text-2xl font-bold font-outfit text-primary uppercase tracking-wider">{section.category}</h2>
                </div>
                <div className="space-y-4">
                  {section.questions.map((faq, qIdx) => {
                    const id = `${sIdx}-${qIdx}`
                    const isOpen = openIndex === id
                    return (
                      <motion.div 
                        key={qIdx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * qIdx }}
                        className={`group rounded-[32px] border transition-all duration-300 ${isOpen ? 'bg-white border-secondary shadow-xl' : 'bg-white/50 border-border hover:border-secondary/50'}`}
                      >
                        <button 
                          onClick={() => toggle(id)}
                          className="w-full text-left px-8 py-6 flex items-center justify-between gap-4"
                        >
                          <span className="text-lg font-bold text-primary group-hover:text-secondary transition-colors italic">
                            {faq.q}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-secondary' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-8 pb-8 text-muted-foreground leading-relaxed text-lg border-t border-muted/20 pt-4">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary p-12 rounded-[48px] text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h3 className="text-3xl font-bold text-white font-outfit">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-primary-foreground/70 text-lg">Notre équipe de support est là pour vous accompagner 7j/7.</p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="/contact" className="px-8 py-4 bg-secondary text-primary font-black rounded-full hover:bg-white transition-all transform hover:scale-105">
                Nous contacter
              </a>
              <a href="https://wa.me/971000000000" className="px-8 py-4 bg-emerald-500 text-white font-black rounded-full hover:bg-emerald-600 transition-all transform hover:scale-105 flex items-center gap-2">
                WhatsApp Express
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
