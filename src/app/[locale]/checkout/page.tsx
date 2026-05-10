'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/useCart'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ShoppingBag, MapPin, ArrowRight, Loader2, CheckCircle2, ChevronLeft, ShieldCheck, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { AddressManager } from '@/components/dashboard/settings/AddressManager'
import Link from 'next/link'
import { createOrder, getFreightEstimate, getUserAddresses } from './actions'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [fetchingAddresses, setFetchingAddresses] = useState(true)

  // Freight States
  const [freightOptions, setFreightOptions] = useState<any[]>([])
  const [loadingFreight, setLoadingFreight] = useState(false)
  const [selectedFreightIdx, setSelectedFreightIdx] = useState<number>(0)
  const [paymentMode, setPaymentMode] = useState<'PREPAID' | 'PAY_AT_DESTINATION'>('PREPAID')

  const supabase = createClient()

  const getProfile = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      toast.error("Vous devez être connecté pour continuer.")
      router.push('/login?next=/checkout')
      return
    }
    setUser(authUser)

    const result = await getUserAddresses()
    if (result.success && result.addresses) {
      setAddresses(result.addresses)
      const defaultAddr = result.addresses.find((a: any) => a.isDefault)
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
      else if (result.addresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(result.addresses[0].id)
      }
    } else if (result.error) {
      toast.error(result.error)
    }
    
    setFetchingAddresses(false)
  }

  useEffect(() => {
    if (items.length === 0) {
      router.push('/marketplace')
      return
    }

    getProfile()
  }, [items, router])

  useEffect(() => {
    async function fetchFreight() {
      if (!selectedAddressId) return
      setLoadingFreight(true)
      const res = await getFreightEstimate(selectedAddressId, items)
      if (res.success && res.options) {
        setFreightOptions(res.options)
        setSelectedFreightIdx(0) // auto select the cheapest (it's sorted)
        if (res.options.length > 0 && !res.options[0].allowPayAtDestination) {
           setPaymentMode('PREPAID')
        }
      }
      setLoadingFreight(false)
    }
    fetchFreight()
  }, [selectedAddressId, items])

  const handleConfirmOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Veuillez sélectionner une adresse de livraison.")
      return
    }

    setLoading(true)
    
    let freightEstimatedAmount = 0
    let transportMode = undefined
    let freightPaymentMode = undefined
    
    const selectedRule = freightOptions[selectedFreightIdx]
    
    if (selectedRule) {
       freightEstimatedAmount = selectedRule.amount
       transportMode = selectedRule.transportMode
       freightPaymentMode = paymentMode
    }

    const result = await createOrder({
      items,
      // If PREPAID, we add the freight to the checkout total sent to server OR we can let server handle it. 
      // Let's send the final amount.
      totalAmount: totalPrice() + (freightPaymentMode === 'PREPAID' ? freightEstimatedAmount : 0),
      addressId: selectedAddressId,
      freightEstimatedAmount,
      transportMode,
      freightPaymentMode
    })

    if (result.success) {
      if (result.checkoutUrl) {
        // Redirection vers Stripe
        window.location.href = result.checkoutUrl
      } else {
        toast.success("Commande confirmée !")
        clearCart()
        router.push(`/checkout/success?orderNumber=${result.orderNumber}`)
      }
    } else {
      toast.error(result.error || "Une erreur est survenue.")
      setLoading(false)
    }
  }

  const selectedRule = freightOptions[selectedFreightIdx]
  const freightCost = selectedRule ? selectedRule.amount : 0
  const finalTotal = totalPrice() + (paymentMode === 'PREPAID' ? freightCost : 0)

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/marketplace" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-bold uppercase text-xs tracking-widest"
          >
            <ChevronLeft size={16} /> Retour à l'exploration
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Flow */}
            <div className="lg:col-span-8 space-y-10">
              <header className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black font-outfit text-primary tracking-tighter">
                  Finalisez votre <span className="text-secondary italic">commande</span>
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                  Révisez vos articles et choisissez votre destination de livraison.
                </p>
              </header>

              {/* Shipping Address Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">1. Adresse de Livraison</h2>
                </div>

                {fetchingAddresses ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-secondary" />
                  </div>
                ) : (
                  <AddressManager 
                    addresses={addresses} 
                    selectedId={selectedAddressId}
                    onSelect={setSelectedAddressId}
                    onSuccess={getProfile} 
                  />
                )}
              </section>

              {/* Order Items Summary */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <ShoppingBag size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">2. Vos Articles</h2>
                </div>

                <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <div key={item.id} className="p-8 flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden border bg-white shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">{item.shopName}</p>
                          <h4 className="font-black text-primary text-lg truncate">{item.name}</h4>
                          <p className="text-muted-foreground text-sm font-bold">Quantité : {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-primary">$ {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* Freight Options Selection (only if multiple) */}
              {selectedAddressId && !loadingFreight && freightOptions.length > 1 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <Truck size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">3. Mode d'expédition</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {freightOptions.map((opt, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setSelectedFreightIdx(idx)
                          if (!opt.allowPayAtDestination) setPaymentMode('PREPAID')
                        }}
                        className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                          selectedFreightIdx === idx 
                          ? 'border-secondary bg-white shadow-xl' 
                          : 'border-slate-100 bg-white/50 hover:border-slate-300'
                        }`}
                      >
                        {selectedFreightIdx === idx && (
                          <div className="absolute top-4 right-4 text-secondary">
                            <CheckCircle2 size={24} />
                          </div>
                        )}
                        <h4 className="font-black text-primary uppercase">
                          {opt.transportMode === 'AIR' ? 'Express (Aérien)' : 'Standard (Maritime)'}
                        </h4>
                        <p className="text-muted-foreground text-sm font-medium mt-1">
                          Délai estimé : {opt.estimatedMinDays} à {opt.estimatedMaxDays} jours
                        </p>
                        <p className="mt-4 font-black text-secondary text-xl">$ {opt.amount}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Freight Payment Selection */}
              {selectedAddressId && !loadingFreight && selectedRule && selectedRule.allowPayAtDestination && (
                <section className="space-y-6">
                   <h3 className="text-xl font-black text-primary uppercase tracking-tighter">Paiement du Fret</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setPaymentMode('PREPAID')}
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${paymentMode === 'PREPAID' ? 'border-secondary bg-secondary/5' : 'border-slate-100 bg-white'}`}
                      >
                         <h4 className="font-black text-primary uppercase">Payer maintenant (Prépayé)</h4>
                         <p className="text-xs text-muted-foreground mt-1">Le fret est ajouté au total de votre commande.</p>
                      </div>
                      <div 
                        onClick={() => setPaymentMode('PAY_AT_DESTINATION')}
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${paymentMode === 'PAY_AT_DESTINATION' ? 'border-secondary bg-secondary/5' : 'border-slate-100 bg-white'}`}
                      >
                         <h4 className="font-black text-primary uppercase">Payer à l'arrivée</h4>
                         <p className="text-xs text-muted-foreground mt-1">Vous paierez le fret à la réception du colis.</p>
                      </div>
                   </div>
                </section>
              )}
            </div>

            {/* Right Column: Sticky Summary */}
            <div className="lg:col-span-4">
              <Card className="sticky top-32 p-10 rounded-[48px] border-none shadow-2xl bg-primary text-white space-y-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                
                <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter">Récapitulatif</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-primary-foreground/60 font-bold uppercase text-xs tracking-widest">
                    <span>Sous-total ({totalItems()} articles)</span>
                    <span>$ {totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-primary-foreground/60 font-bold uppercase text-xs tracking-widest">
                    <span>Livraison</span>
                    {!selectedAddressId ? (
                      <span className="text-secondary italic">Adresse requise</span>
                    ) : loadingFreight ? (
                      <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Calcul...</span>
                    ) : selectedRule ? (
                      <span className="text-white">
                        {paymentMode === 'PREPAID' ? `$ ${selectedRule.amount}` : 'À destination ($ 0)'}
                      </span>
                    ) : (
                      <span className="text-secondary italic">Sur devis</span>
                    )}
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-tighter">Total à payer</span>
                    <span className="text-3xl font-black text-secondary">$ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3 p-4 rounded-3xl bg-white/5 border border-white/10">
                    <Truck className="text-secondary shrink-0" size={18} />
                    <p className="text-[10px] font-medium leading-relaxed text-primary-foreground/80">
                      Nos experts logistiques vous contacteront pour coordonner l'expédition vers votre destination.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-3xl bg-white/5 border border-white/10">
                    <ShieldCheck className="text-secondary shrink-0" size={18} />
                    <p className="text-[10px] font-medium leading-relaxed text-primary-foreground/80">
                      Paiement sécurisé et vérification de conformité Sharufa à chaque étape.
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleConfirmOrder}
                  disabled={loading || !selectedAddressId}
                  className="w-full py-10 rounded-[32px] bg-secondary text-primary font-black text-xl uppercase tracking-widest shadow-2xl hover:bg-white transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      Confirmer la Commande <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
