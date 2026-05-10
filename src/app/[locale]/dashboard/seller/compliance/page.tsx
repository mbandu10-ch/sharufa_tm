import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Info,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ComplianceForm } from '@/components/dashboard/compliance/ComplianceForm'
import { DocumentList } from '@/components/dashboard/compliance/DocumentList'
import { cn } from '@/lib/utils'

export default async function CompliancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      shop: {
        include: {
          legalProfile: true,
          documents: {
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  })

  const shop = profile?.shop
  if (!shop && profile?.role !== 'ADMIN') {
    redirect('/dashboard/buyer')
  }

  const finalShop = shop || await prisma.shop.findUnique({ 
    where: { slug: 'sharufa-store' },
    include: { legalProfile: true, documents: true }
  })
  if (!finalShop) redirect('/dashboard/buyer')

  // Status mapping for better UX
  const statusConfig: Record<string, { label: string, color: string, icon: any, desc: string }> = {
    VERIFIED: { 
      label: 'Compte Vérifié', 
      color: 'bg-green-500 text-white border-green-600', 
      icon: CheckCircle2,
      desc: 'Votre boutique est pleinement éligible à la vente internationale.'
    },
    SUBMITTED: { 
      label: 'Examen en cours', 
      color: 'bg-blue-500 text-white border-blue-600', 
      icon: Clock,
      desc: 'Nos agents vérifient vos documents. Délai moyen : 48h.'
    },
    INCOMPLETE: { 
      label: 'Action Requise', 
      color: 'bg-amber-500 text-white border-amber-600', 
      icon: AlertTriangle,
      desc: 'Veuillez compléter vos informations et soumettre vos documents.'
    },
    RENEWAL_REQUIRED: { 
      label: 'Renouvellement', 
      color: 'bg-orange-500 text-white border-orange-600', 
      icon: Info,
      desc: 'Certains documents ont expiré et doivent être mis à jour.'
    },
    EXPIRED: { 
      label: 'Documents Expirés', 
      color: 'bg-red-500 text-white border-red-600', 
      icon: ShieldAlert,
      desc: 'Votre éligibilité a été suspendue suite à l\'expiration de vos documents.'
    }
  }

  const currentStatus = statusConfig[finalShop.verificationStatus] || statusConfig.INCOMPLETE

  return (
    <div className="space-y-8 max-w-7xl animate-in fade-in duration-1000">
      {/* Global Status Header */}
      <div className={cn(
        "rounded-[40px] p-8 md:p-12 border shadow-2xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden",
        finalShop.verificationStatus === 'VERIFIED' ? "bg-[#002B24] border-emerald-900" : "bg-primary border-white/10"
      )}>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-[100px] opacity-20" />
         
         <div className={cn(
            "w-20 h-20 md:w-28 md:h-28 rounded-[32px] md:rounded-[40px] flex items-center justify-center shrink-0 shadow-2xl relative z-10",
            finalShop.verificationStatus === 'VERIFIED' ? "bg-emerald-500 text-white" : "bg-secondary text-primary"
         )}>
            <currentStatus.icon size={finalShop.verificationStatus === 'VERIFIED' ? 48 : 56} />
         </div>

         <div className="flex-1 text-center md:text-left space-y-3 z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">Contrôle de Conformité</span>
               {finalShop.verificationStatus === 'VERIFIED' && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0">
                     Certifié Sharufa
                  </Badge>
               )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white font-outfit tracking-tighter italic">
               {currentStatus.label}
            </h1>
            <p className="text-white/60 font-medium text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
               {currentStatus.desc}
            </p>
         </div>

         {finalShop.verificationStatus === 'VERIFIED' && (
            <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 text-center relative z-10 min-w-[200px]">
               <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 opacity-80">Date de Certification</div>
               <div className="text-white font-black text-2xl font-outfit tracking-tight italic">
                  {finalShop.verifiedAt ? new Date(finalShop.verifiedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '---'}
               </div>
            </div>
         )}
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
         {/* Forms Section */}
         <div className="w-full xl:w-3/5 space-y-6">
            <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                     <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic leading-none">Profil Légal & Bancaire</h3>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Informations pour les transactions et la facturation</p>
                  </div>
               </div>

               <ComplianceForm 
                 shopId={finalShop.id} 
                 initialData={finalShop.legalProfile || {}} 
               />
            </section>

            {/* Instruction Box */}
            <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[40px] flex gap-6 items-start">
               <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                  <Info size={24} />
               </div>
               <div className="space-y-2">
                  <h4 className="font-black text-blue-900 uppercase tracking-wide text-sm italic">Pourquoi la conformité ?</h4>
                  <p className="text-blue-800/70 text-sm font-medium leading-relaxed">
                     Pour garantir la sécurité des transactions et respecter les régulations internationales d&apos;import-export, 
                     Sharufa doit vérifier l&apos;identité et l&apos;existence légale de chaque vendeur avant de permettre l&apos;activation du storefront.
                  </p>
               </div>
            </div>
         </div>

         {/* Documents Section */}
         <div className="w-full xl:w-2/5 space-y-6 sticky xl:top-6 self-start">
            <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-full flex flex-col">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                     <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic">Documents</h3>
               </div>
               
               <div className="flex-1">
                  <DocumentList 
                    shopId={finalShop.id} 
                    documents={finalShop.documents} 
                  />
               </div>

               <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 italic space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                     <ArrowRight size={12} className="text-secondary" /> Prochaines Étapes
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                     Une fois tous vos documents validés, votre boutique passera automatiquement en mode <span className="text-primary font-black">&quot;Éligible&quot;</span>.
                  </p>
               </div>
            </section>
         </div>
      </div>
    </div>
  )
}
