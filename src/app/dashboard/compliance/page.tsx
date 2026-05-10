import React from 'react'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { ComplianceForm } from '@/components/dashboard/compliance/ComplianceForm'
import { DocumentList } from '@/components/dashboard/compliance/DocumentList'
import { ShieldCheck, AlertCircle, Info } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function CompliancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const shop = await prisma.shop.findUnique({
    where: { ownerId: user.id },
    include: {
      legalProfile: true,
      documents: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!shop) {
    redirect('/seller')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-500 bg-green-50'
      case 'SUBMITTED': return 'text-blue-500 bg-blue-50'
      case 'EXPIRED': return 'text-red-500 bg-red-50'
      case 'RENEWAL_REQUIRED': return 'text-orange-500 bg-orange-50'
      default: return 'text-slate-500 bg-slate-50'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[22px] bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-black text-primary tracking-tight mb-1">Conformité & Vérification</h1>
            <p className="text-slate-500 font-medium">Gérez vos documents légaux et vérifiez votre boutique.</p>
          </div>
        </div>
        
        <div className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-3 ${getStatusColor(shop.verificationStatus)}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${shop.verificationStatus === 'VERIFIED' ? 'bg-green-500' : 'bg-current'}`} />
          Statut : {shop.verificationStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Info Form */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">Informations Entreprise & Banque</h2>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <ComplianceForm 
              shopId={shop.id} 
              initialData={shop.legalProfile || {}} 
            />
          </section>
        </div>

        {/* Sidebar: Documents */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">Documents</h2>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            
            <DocumentList 
              shopId={shop.id} 
              documents={shop.documents} 
            />

            <div className="mt-8 p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
               <div className="flex gap-3 text-primary">
                  <Info size={20} className="shrink-0 text-secondary" />
                  <div className="text-sm font-medium leading-relaxed italic">
                    Assurez-vous que vos documents sont lisibles et à jour pour éviter tout retard de validation.
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>

      {/* Info Alert if Pending Verification */}
      {shop.verificationStatus === 'SUBMITTED' && (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-[24px] flex gap-4 items-start">
          <AlertCircle className="text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-black text-blue-900 uppercase tracking-wide text-sm">Vérification en cours</h4>
            <p className="text-blue-700/80 text-sm font-medium">Nos agents traitent actuellement vos informations. Vous recevrez une notification dès que votre compte sera validé.</p>
          </div>
        </div>
      )}
    </div>
  )
}
