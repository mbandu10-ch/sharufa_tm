import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { UserSourcingList } from '@/components/dashboard/sourcing/UserSourcingList'
import { Package, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function BuyerSourcingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const sourcingRequests = await prisma.sourcingRequest.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-10 max-w-7xl italic">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 italic">
                 Buy For Me
               </span>
            </div>
            <h1 className="text-5xl font-black font-outfit text-primary tracking-tighter leading-none italic">
               Mes Demandes de <span className="text-secondary italic">Sourcing</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium italic">Gérez vos demandes d'importation personnalisées et suivez vos devis.</p>
         </div>

         <Link 
            href="/buy-for-me"
            className="flex items-center gap-3 bg-primary text-white px-8 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 italic"
         >
            <Plus size={18} /> Nouvelle Demande
         </Link>
      </div>

      <div className="pt-10 border-t border-primary/5">
         <UserSourcingList requests={sourcingRequests as any} />
      </div>
    </div>
  )
}
