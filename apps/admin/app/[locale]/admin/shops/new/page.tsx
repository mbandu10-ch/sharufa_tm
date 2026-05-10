'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Send, UserPlus, Info, CheckCircle2 } from 'lucide-react'
import { Button } from '@sharufa/ui/components/button'
import { Input } from '@sharufa/ui/components/input'
import { Label } from '@sharufa/ui/components/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sharufa/ui/components/card'
import { toast } from 'sonner'
import { inviteSeller } from '@/lib/actions/admin/shops/actions'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'

export default function InviteSellerPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [method, setMethod] = React.useState<'EMAIL' | 'WHATSAPP'>('EMAIL')
  const [success, setSuccess] = React.useState(false)
  const [generatedLink, setGeneratedLink] = React.useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    formData.append('method', method)
    
    const res = await inviteSeller(formData)
    setIsSubmitting(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      if (method === 'EMAIL') {
        toast.success(res.message)
        setSuccess(true)
      } else if (res.link) {
        setGeneratedLink(res.link)
        const sellerName = formData.get('sellerName') as string || 'Vendeur'
        const whatsappMessage = encodeURIComponent(`Bonjour ${sellerName}, nous serions ravis de vous compter parmi nos partenaires sur Sharufa.com, la première plateforme B2B premium entre Dubaï, la Turquie et l'Afrique. Rejoignez-nous ici : ${res.link}`)
        const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`
        window.open(whatsappUrl, '_blank')
        toast.success('Lien WhatsApp généré !')
        setSuccess(true)
      }
    }
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="rounded-full w-12 h-12 p-0 hover:bg-white shadow-sm border border-primary/5">
          <Link href="/admin/shops">
            <ArrowLeft size={20} className="text-primary" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black font-outfit text-primary uppercase tracking-tighter italic">Nouveau Partenaire</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest italic">Expansion de l'écosystème Sharufa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <Card className="rounded-[48px] border-none shadow-2xl shadow-primary/5 bg-white overflow-hidden">
            <CardHeader className="bg-[#002B24] p-10 text-white relative overflow-hidden italic">
              <UserPlus size={120} className="absolute -right-8 -bottom-8 text-white/5 opacity-40 rotate-12" />
              <CardTitle className="text-2xl font-black uppercase tracking-tighter italic relative z-10">Inviter un Vendeur</CardTitle>
              <CardDescription className="text-white/60 font-medium italic relative z-10">
                L'invitation permet au vendeur de créer son compte avec un accès privilégié.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <div className="flex p-1.5 bg-slate-100 rounded-full mb-10 italic">
                <button 
                  onClick={() => setMethod('EMAIL')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic",
                    method === 'EMAIL' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Mail size={14} /> E-mail
                </button>
                <button 
                  onClick={() => setMethod('WHATSAPP')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic",
                    method === 'WHATSAPP' ? "bg-white text-secondary shadow-sm" : "text-muted-foreground hover:text-secondary"
                  )}
                >
                  <MessageCircle size={14} /> WhatsApp
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 italic">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="sellerName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 italic">Nom du Vendeur (Optionnel)</Label>
                    <Input 
                      id="sellerName" 
                      name="sellerName" 
                      placeholder="Ex: Boutique Ahmed" 
                      className="bg-slate-50 border-none rounded-2xl h-14 px-8 text-sm font-black text-primary italic focus:ring-secondary/50 placeholder:text-muted-foreground/30"
                    />
                  </div>

                  {method === 'EMAIL' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 italic">Adresse E-mail *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="vendeur@sharufa.com" 
                        required={method === 'EMAIL'}
                        className="bg-slate-50 border-none rounded-2xl h-14 px-8 text-sm font-black text-primary italic focus:ring-secondary/50 placeholder:text-muted-foreground/30"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4 italic">
                  <Info size={20} className="text-secondary shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-primary/60 leading-relaxed uppercase tracking-tight italic">
                    {method === 'EMAIL' 
                      ? "L'invitation enverra un e-mail premium contenant un lien d'inscription direct et sécurisé." 
                      : "Générez un lien d'invitation que vous pourrez envoyer directement via WhatsApp."}
                  </p>
                </div>

                <Button 
                  disabled={isSubmitting}
                  type="submit" 
                  className={cn(
                    "w-full text-white font-black py-8 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-[0.2em] italic shadow-primary/20 hover:shadow-2xl hover:-translate-y-1",
                    method === 'EMAIL' ? "bg-primary" : "bg-[#25D366] hover:bg-[#128C7E] shadow-[#25D366]/20"
                  )}
                >
                  {isSubmitting ? 'Traitement...' : method === 'EMAIL' ? 'Envoyer l\'invitation' : 'Ouvrir WhatsApp'}
                  <Send size={16} className="ml-3" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-[48px] border-none shadow-xl shadow-primary/5 bg-white overflow-hidden p-10 h-full relative group">
             {success ? (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter">Mission Réussie !</h3>
                    <p className="text-muted-foreground font-medium mt-2 italic px-8 uppercase text-[10px] tracking-widest">L'invitation est prête. Le partenaire peut désormais rejoindre l'écosystème Sharufa.</p>
                  </div>
                  <Button asChild variant="outline" className="rounded-full border-2 border-slate-100 font-black uppercase text-[10px] tracking-widest px-8">
                     <Link href="/admin/shops">Retour à la liste</Link>
                  </Button>
               </div>
             ) : (
               <div className="space-y-8 italic">
                 <div className="w-20 h-2 bg-secondary rounded-full" />
                 <h3 className="text-4xl font-black text-primary uppercase tracking-tighter italic leading-none">Pourquoi inviter ?</h3>
                 <p className="text-slate-500 font-medium leading-relaxed italic">
                   Convertir un prospect en vendeur Sharufa, c'est lui offrir un accès immédiat aux marchés de **Dubaï**, de **Turquie** et de **Chine**.
                 </p>
                 <div className="space-y-4">
                    {[
                      "Accompagnement Logistique Premium",
                      "Espace de gestion dédié (Dashboard)",
                      "Paiements Sécurisés & Instantanés",
                      "Visibilité B2B Internationale"
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary italic">
                        <CheckCircle2 size={16} className="text-secondary" /> {text}
                      </div>
                    ))}
                 </div>
                 <div className="pt-10 opacity-10 flex justify-center grayscale">
                   <Logo className="w-40 h-20" />
                 </div>
               </div>
             )}
          </Card>
        </div>
      </div>
    </div>
  )
}
