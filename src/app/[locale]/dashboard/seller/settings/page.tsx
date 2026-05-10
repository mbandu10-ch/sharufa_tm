import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from '@/components/dashboard/settings/ProfileForm'
import { SecurityForm } from '@/components/dashboard/settings/SecurityForm'
import { ComplianceForm } from '@/components/dashboard/compliance/ComplianceForm'
import { DocumentList } from '@/components/dashboard/compliance/DocumentList'
import { 
  User, 
  Store, 
  ShieldCheck, 
  CreditCard, 
  Truck,
  FileText
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SellerSettingsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ tab?: string }> 
}) {
  const { tab } = await searchParams
  const defaultTab = tab || 'shop'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch complete profile and shop for seller
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
    redirect('/dashboard/buyer/settings')
  }

  return (
    <div className="space-y-10 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
              Paramètres Vendeur
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">
              {shop?.name || 'Sharufa Partner'}
            </span>
         </div>
         <h1 className="text-5xl font-black font-outfit text-primary tracking-tighter leading-none">
            Gestion <span className="text-secondary italic">Partenaire</span>
         </h1>
         <p className="text-muted-foreground text-lg font-medium">Configurez votre identité commerciale, vos documents légaux et vos préférences de vente.</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full space-y-10">
        <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]"><TabsList className="inline-flex min-w-max items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1">
          <TabsTrigger 
            value="shop" 
            className="rounded-full px-6 py-2.5 font-bold text-sm uppercase tracking-wider transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-2"
          >
            <Store size={18} /> Ma Boutique
          </TabsTrigger>
          <TabsTrigger 
            value="compliance" 
            className="rounded-full px-4 py-2 text-sm font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <FileText size={18} /> Conformité
          </TabsTrigger>
          <TabsTrigger 
            value="payout" 
            className="rounded-full px-4 py-2 text-sm font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <CreditCard size={18} /> Versements
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="rounded-full px-4 py-2 text-sm font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <User size={18} /> Profil Perso
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="rounded-full px-4 py-2 text-sm font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <ShieldCheck size={18} /> Sécurité
          </TabsTrigger>
        </TabsList></div>

        <TabsContent value="shop" className="animate-in fade-in slide-in-from-left-4 duration-500">
           <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8 italic">Identité de la Boutique</h3>
              <p className="text-muted-foreground font-medium mb-10">Mettez à jour le nom, le logo et la description de votre point de vente Sharufa.</p>
              {/* Future: ShopInfoForm */}
              <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Édition rapide disponible prochainement</p>
                 <p className="text-xs text-slate-400 mt-2">Pour modifier ces infos, veuillez contacter le support ou passer par le centre d&apos;assistance.</p>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="compliance" className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                 <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8 italic">Informations Légales</h3>
                    {shop && (
                      <ComplianceForm 
                        shopId={shop.id} 
                        initialData={shop.legalProfile || {}} 
                      />
                    )}
                 </section>
              </div>
              <div className="lg:col-span-1">
                 <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-full">
                    <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8 italic">Documents</h3>
                    {shop && (
                      <DocumentList 
                        shopId={shop.id} 
                        documents={shop.documents} 
                      />
                    )}
                 </section>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="payout" className="animate-in fade-in slide-in-from-left-4 duration-500">
           <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8 italic">Méthodes de Versement</h3>
              <p className="text-muted-foreground font-medium mb-10">Configurez vos comptes bancaires ou portefeuilles mobiles pour recevoir vos fonds.</p>
              <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                 <div>
                    <p className="text-emerald-900 font-black uppercase text-sm tracking-widest">Statut Financier</p>
                    <p className="text-emerald-700 text-sm font-medium">Virement automatique hebdomadaire activé.</p>
                 </div>
                 <CreditCard className="text-emerald-300" size={40} />
              </div>
           </div>
        </TabsContent>

        <TabsContent value="profile" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <ProfileForm profile={profile} />
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
