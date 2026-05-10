import React from 'react'
import { prisma } from '@sharufa/db'
import { ShopListTable } from '@/components/admin/compliance/ShopListTable'
import { AlertTriangle, Clock, ArrowLeft, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { differenceInDays, isPast } from 'date-fns'

export default async function AdminComplianceAlertsPage() {
  const shops = await prisma.shop.findMany({
    where: {
      legalProfile: {
        tradeLicenseExpiryDate: {
          not: null
        }
      }
    },
    include: {
      owner: true,
      legalProfile: true
    },
    orderBy: {
      legalProfile: {
        tradeLicenseExpiryDate: 'asc'
      }
    }
  })

  // Catégoriser les alertes
  const expired = shops.filter(s => s.legalProfile?.tradeLicenseExpiryDate && isPast(new Date(s.legalProfile.tradeLicenseExpiryDate)))
  const critical = shops.filter(s => {
    if (!s.legalProfile?.tradeLicenseExpiryDate) return false
    const days = differenceInDays(new Date(s.legalProfile.tradeLicenseExpiryDate), new Date())
    return days > 0 && days <= 7
  })
  const urgent = shops.filter(s => {
    if (!s.legalProfile?.tradeLicenseExpiryDate) return false
    const days = differenceInDays(new Date(s.legalProfile.tradeLicenseExpiryDate), new Date())
    return days > 7 && days <= 30
  })
  const soon = shops.filter(s => {
    if (!s.legalProfile?.tradeLicenseExpiryDate) return false
    const days = differenceInDays(new Date(s.legalProfile.tradeLicenseExpiryDate), new Date())
    return days > 30 && days <= 60
  })

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 text-red-500 mb-2">
           <ShieldAlert size={20} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Monitor d'Expirations</span>
        </div>
        <h1 className="text-4xl font-outfit font-black text-primary uppercase tracking-tighter">Alertes & Renouvellements</h1>
        <p className="text-muted-foreground font-medium mt-2 max-w-2xl">
          Suivi proactif des licences de commerce. Anticipez les interruptions de service en relançant les vendeurs avant l'échéance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-red-50 p-6 rounded-[32px] border border-red-100">
            <div className="text-3xl font-black text-red-600">{expired.length}</div>
            <div className="text-[10px] text-red-400 font-black uppercase tracking-widest mt-1">Expiré</div>
         </div>
         <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100">
            <div className="text-3xl font-black text-orange-600">{critical.length}</div>
            <div className="text-[10px] text-orange-400 font-black uppercase tracking-widest mt-1">Sous 7 jours</div>
         </div>
         <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100">
            <div className="text-3xl font-black text-amber-600">{urgent.length}</div>
            <div className="text-[10px] text-amber-400 font-black uppercase tracking-widest mt-1">Sous 30 jours</div>
         </div>
         <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
            <div className="text-3xl font-black text-blue-600">{soon.length}</div>
            <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">Sous 60 jours</div>
         </div>
      </div>

      <div className="space-y-8">
         <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
               <AlertTriangle size={14} className="text-red-500" /> Licences Expirées ou Critiques ({expired.length + critical.length})
            </h2>
            <ShopListTable shops={[...expired, ...critical]} />
         </section>

         <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
               <Clock size={14} className="text-orange-500" /> Renouvellements à anticiper (30-60 jours)
            </h2>
            <ShopListTable shops={[...urgent, ...soon]} />
         </section>
      </div>

      <div className="flex justify-center pt-8">
         <Link 
            href="/admin/compliance" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
         >
            <ArrowLeft size={14} /> Retour à la conformité
         </Link>
      </div>
    </div>
  )
}
