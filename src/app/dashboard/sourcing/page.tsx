import React from 'react'
import { prisma } from '@/lib/prisma'
import { UserSourcingList } from '@/components/dashboard/sourcing/UserSourcingList'
import { NewSourcingRequestForm } from '@/components/dashboard/sourcing/NewSourcingRequestForm'
import { Globe, Briefcase, Zap, Boxes, TrendingUp, Search, Layers, ShieldCheck, Plus, PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"

export default async function SourcingDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const requests = await prisma.sourcingRequest.findMany({
    where: {
      clientId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-16 pb-20 italic tracking-tighter">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 italic tracking-tighter">
        <div className="space-y-4 italic">
           <div className="flex items-center gap-3 text-secondary uppercase tracking-[0.2em] text-[10px] font-black italic">
              <Globe size={18} />
              <span>Sourcing & Conciergerie Internationale</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-outfit font-black text-primary uppercase tracking-tighter italic">Vos Recherches <br/> d'Achats</h1>
           <p className="text-muted-foreground font-medium max-w-xl leading-relaxed italic tracking-widest text-xs uppercase opacity-70">
             Suivez vos demandes Buy For Me et Sourcing B2B. Nous négocions pour vous au meilleur prix en Turquie, Chine et Dubaï.
           </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 flex items-center gap-6 shadow-inner italic">
           <div className="text-center italic">
              <div className="text-2xl font-black text-primary italic leading-none">{requests.length}</div>
              <div className="text-[9px] font-black text-muted-foreground uppercase mt-1 italic tracking-widest">Dossiers</div>
           </div>
           <div className="w-px h-8 bg-slate-200" />
           <div className="text-center italic">
              <div className="text-2xl font-black text-secondary italic leading-none">{requests.filter(r => r.status === 'QUOTED').length}</div>
              <div className="text-[9px] font-black text-muted-foreground uppercase mt-1 italic tracking-widest">Devis Reçus</div>
           </div>
        </div>
      </div>

      {/* New Request Form section */}
      <div className="relative italic">
         <div className="absolute -top-10 right-10 opacity-10 pointer-events-none italic">
            <PackageOpen size={200} className="text-primary italic" />
         </div>
         <NewSourcingRequestForm userId={user.id} />
      </div>

      {/* Existing Requests Section */}
      <div className="space-y-10 italic">
         <div className="flex items-center justify-between italic tracking-tighter">
            <h2 className="text-2xl font-black text-primary uppercase tracking-tighter italic flex items-center gap-3">
               <Layers size={24} className="text-secondary italic" /> Historique de vos Demandes
            </h2>
         </div>
         <UserSourcingList requests={requests} />
      </div>

      {/* Support / Help card */}
      <div className="bg-primary rounded-[40px] p-12 text-white relative overflow-hidden group shadow-2xl shadow-primary/20 italic tracking-tighter">
         <div className="absolute top-0 right-0 p-12 opacity-5 italic">
            <Globe size={240} className="group-hover:scale-110 transition-transform italic" />
         </div>
         <div className="relative z-10 max-w-2xl italic tracking-tighter">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Besoin d'un accompagnement sur mesure ?</h3>
            <p className="text-white/60 font-medium mb-8 leading-relaxed italic tracking-widest text-[11px] uppercase">
               Pour les commandes industrielles complexes ou les sourcing de marques spécifiques, notre équipe d'experts B2B est disponible pour une consultation directe.
            </p>
            <button className="bg-secondary text-primary px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl shadow-white/5 hover:scale-105 transition-transform italic tracking-tighter">
               Contacter un Expert B2B
            </button>
         </div>
      </div>
    </div>
  )
}
