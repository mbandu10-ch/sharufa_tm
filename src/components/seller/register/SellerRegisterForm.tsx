'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, CheckCircle2, ArrowRight, ArrowLeft, Upload, Image as ImageIcon, Briefcase, ShoppingBag, Car, Wrench, HardHat, Package, Droplets, Utensils, Factory, Baby, Search, Smartphone, Settings, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { registerShop, getDomainCategories } from '@/app/seller/actions'
import { SHOP_LABELS, SHOP_DOMAIN_MAPPING } from '@/lib/constants/shop-categories'
import { ShopType } from '@prisma/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SellerRegisterForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [domains, setDomains] = useState<{id: string, name: string}[]>([])
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  // Form State
  const [formData, setFormData] = useState({
    shopName: '',
    country: 'Turquie',
    description: '',
    type: 'GENERAL_STORE' as ShopType,
    allowedCategoryIds: [] as string[],
  })

  // Fetch domains on mount
  React.useEffect(() => {
    getDomainCategories().then(res => {
      if (res.domains) setDomains(res.domains)
    })
  }, [])

  // File Previews
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Le logo est trop lourd (max 2MB).')
        e.target.value = ''
        setLogoPreview(null)
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La bannière est trop lourde (max 2MB).')
        e.target.value = ''
        setBannerPreview(null)
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit() {
    if (!formRef.current) return
    
    if (!logoPreview) {
      toast.error('Le logo est obligatoire.')
      setStep(3)
      return
    }

    setLoading(true)
    const data = new FormData(formRef.current)
    data.set('allowedCategoryIds', JSON.stringify(formData.allowedCategoryIds))
    const result = await registerShop(data)
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Demande envoyée avec succès ! Notre équipe vous contactera sous 48h.')
      router.push('/seller/register') // Will trigger the server-side redirect to PendingStatusView
      router.refresh()
    }
  }

  const nextStep = () => {
    if (step === 1 && !formData.shopName) {
      toast.error('Veuillez entrer le nom de votre boutique.')
      return
    }
    if (step === 3 && formData.allowedCategoryIds.length === 0) {
      toast.error('Veuillez sélectionner au moins une catégorie de produits.')
      return
    }
    setStep(s => s + 1)
  }
  
  const prevStep = () => setStep(s => s - 1)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-outfit font-black text-primary mb-4"
        >
          Devenir <span className="text-secondary italic">Partenaire</span>
        </motion.h1>
        <p className="text-muted-foreground text-lg">Rejoignez l&apos;écosystème Sharufa et vendez dans le monde entier.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-primary text-white' : 'bg-white text-slate-300 border border-slate-200'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <motion.div 
        layout
        className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[40px] shadow-2xl shadow-primary/5 border border-slate-100"
      >
        <form ref={formRef} action={handleSubmit} className="space-y-8">
          {/* Hidden inputs to preserve data from previous steps when unmounted */}
          <input type="hidden" name="shopName" value={formData.shopName} />
          <input type="hidden" name="country" value={formData.country} />
          <input type="hidden" name="description" value={formData.description} />
          <input type="hidden" name="type" value={formData.type} />
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold text-primary">Informations Générales</h2>
                   <p className="text-sm text-muted-foreground">Commençons par les bases de votre activité.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">Nom de la Boutique / Entreprise *</label>
                    <input 
                      required
                      value={formData.shopName}
                      onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                      placeholder="Ex: Istanbul Luxury Fashion"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-primary mb-2">Pays d&apos;Origine</label>
                      <select 
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none bg-white font-medium"
                      >
                        <option value="Turquie">Turquie</option>
                        <option value="UAE">Émirats Arabes Unis (Dubaï)</option>
                        <option value="Chine">Chine</option>
                        <option value="Afrique">Afrique (Global)</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">Description de votre activité</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Décrivez votre expérience, vos produits et votre capacité de production..."
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 2 : Spécialité de la Boutique */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold text-primary">Spécialité de votre Boutique</h2>
                   <p className="text-sm text-muted-foreground">Sélectionnez le type qui décrit le mieux votre activité principale.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {(Object.keys(SHOP_LABELS) as ShopType[]).map((st) => {
                    const isSelected = formData.type === st
                    const Icon = {
                      FASHION_STORE: ShoppingBag,
                      BEAUTY_STORE: Droplets,
                      HOME_STORE: Store,
                      ELECTRONICS_STORE: Smartphone,
                      VEHICLE_SHOWROOM: Car,
                      AUTO_PARTS_STORE: Settings,
                      CONSTRUCTION_STORE: HardHat,
                      PACKAGING_STORE: Package,
                      FMCG_STORE: Sparkles,
                      FOOD_STORE: Utensils,
                      INDUSTRIAL_STORE: Factory,
                      KIDS_STORE: Baby,
                      GENERAL_STORE: Store,
                      WHOLESALE_STORE: Briefcase,
                    }[st] || Store

                    return (
                      <div 
                        key={st}
                        onClick={() => {
                          setFormData({
                            ...formData, 
                            type: st,
                            // Reset categories when type changes to match allowed domains
                            allowedCategoryIds: [] 
                          })
                        }}
                        className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-3 ${
                          isSelected 
                          ? 'border-secondary bg-secondary/10 shadow-lg shadow-secondary/5 scale-[1.02]' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-secondary text-primary' : 'bg-slate-50 text-slate-400'}`}>
                           <Icon className="w-6 h-6" />
                         </div>
                         <span className={`text-[11px] font-black uppercase tracking-widest leading-tight ${isSelected ? 'text-primary' : 'text-slate-500'}`}>
                           {SHOP_LABELS[st]}
                         </span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Étape 3 : Domaines & Modèle */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold text-primary">Domaines d&apos;Activité</h2>
                   <p className="text-sm text-muted-foreground">
                     Basé sur votre type <span className="text-secondary font-bold font-black">{SHOP_LABELS[formData.type]}</span>, 
                     voici les domaines où vous pouvez publier.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domains
                    .filter(d => SHOP_DOMAIN_MAPPING[formData.type]?.includes(d.name))
                    .map((domain) => {
                      const isSelected = formData.allowedCategoryIds.includes(domain.id)
                      return (
                        <div 
                          key={domain.id}
                          onClick={() => {
                            if (isSelected) {
                              setFormData({
                                ...formData, 
                                allowedCategoryIds: formData.allowedCategoryIds.filter(id => id !== domain.id)
                              })
                            } else {
                              setFormData({
                                ...formData, 
                                allowedCategoryIds: [...formData.allowedCategoryIds, domain.id]
                              })
                            }
                          }}
                          className={`p-6 rounded-[28px] border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                            isSelected 
                            ? 'border-secondary bg-secondary/5 shadow-md' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                           <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-secondary text-primary' : 'bg-slate-50 text-slate-400'}`}>
                               <Search className="w-5 h-5" />
                             </div>
                             <span className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-slate-500'}`}>
                               {domain.name}
                             </span>
                           </div>
                           {isSelected && <CheckCircle2 className="w-5 h-5 text-secondary" />}
                        </div>
                      )
                    })}
                </div>
                
                {formData.type === 'WHOLESALE_STORE' && (
                  <div className="p-6 bg-amber-50 rounded-[32px] border border-amber-100 flex gap-4 items-start">
                    <Briefcase className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-900">Règle Grossiste Activée</h4>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        En tant que grossiste, tous vos produits auront un minimum de commande (MOQ) de 6 unités par défaut pour garantir des transactions B2B.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold text-primary">Identité Visuelle</h2>
                   <p className="text-sm text-muted-foreground">Personnalisez l&apos;apparence de votre future boutique.</p>
                </div>

                <div className="space-y-8">
                  {/* Logo Upload */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 text-center sm:text-left">
                    <div className="relative w-32 h-32 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 group">
                      {logoPreview ? (
                        <Image src={logoPreview} alt="Logo Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-slate-300" />
                      )}
                      <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Upload className="w-6 h-6 text-white" />
                         <input type="file" name="logo" accept="image/*" className="sr-only" onChange={handleLogoChange} />
                      </label>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-primary">Logo de la Boutique *</h4>
                      <p className="text-sm text-muted-foreground italic">Carré requis. Max 2MB. Format PNG/JPG.</p>
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-primary">Bannière de la Boutique (Optionnel)</h4>
                      <p className="text-sm text-muted-foreground italic">Recommandé : 1920x400. Donnez du style à votre shop.</p>
                    </div>
                    <div className="relative w-full h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group">
                       {bannerPreview ? (
                        <Image src={bannerPreview} alt="Banner Preview" fill className="object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="w-10 h-10 text-slate-300" />
                            <span className="text-xs text-slate-400 font-bold">CLIQUER POUR AJOUTER</span>
                        </div>
                      )}
                      <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Upload className="w-6 h-6 text-white" />
                         <input type="file" name="banner" accept="image/*" className="sr-only" onChange={handleBannerChange} />
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            {step > 1 ? (
              <button 
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Retour
              </button>
            ) : <div />}

            {step < 4 ? (
              <button 
                type="button"
                onClick={nextStep}
                className="px-6 py-4 md:px-10 md:py-5 bg-primary text-white rounded-full font-black text-base md:text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:translate-x-1 transition-transform w-full sm:w-auto"
              >
                Continuer <ArrowRight className="w-5 h-5 text-secondary" />
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-4 md:px-12 md:py-5 bg-secondary text-primary rounded-full font-black text-base md:text-xl shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 hover:scale-105 transition-transform w-full sm:w-auto"
              >
                {loading ? 'Création...' : (
                  <>
                    Ouvrir ma boutique <Store className="w-5 h-5 md:w-6 md:h-6" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <p className="text-center mt-12 text-sm text-muted-foreground font-medium">
        En continuant, vous acceptez les <Link href="/terms" className="text-primary hover:underline">conditions générales de vente</Link> de Sharufa.
      </p>
    </div>
  )
}
