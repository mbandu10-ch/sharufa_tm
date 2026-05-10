import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
  Truck, 
  ShoppingBag, 
  MapPin, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'

/**
 * Layout sécurisé pour les partenaires Logistique (CARGO)
 */
export default async function CargoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Vérifier si l'utilisateur est un CARGO
  const profile = await prisma.profile.findUnique({ 
    where: { id: user.id },
    include: { cargo: true }
  })
  
  if (profile?.role !== 'CARGO') {
    redirect('/dashboard')
  }

  const cargoName = profile?.cargo?.name || "Partenaire Logistique"

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Partenaire */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#001D1A] border-r border-white/5 z-50 flex flex-col">
          <div className="p-8 pb-12">
            <Link href="/cargo" className="block">
              <Logo />
              <div className="mt-4 p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                 <div className="text-[10px] text-secondary font-black uppercase tracking-[0.2em]">Espace Cargo</div>
                 <div className="text-sm font-black text-white truncate italic">{cargoName}</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <Link href="/cargo" className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-secondary text-primary font-black text-sm shadow-xl shadow-secondary/10">
               <LayoutDashboard size={18} />
               <span>Commandes Assignées</span>
            </Link>
            <Link href="/cargo/notifications" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white/50 hover:bg-white/5 hover:text-white transition-all font-bold text-sm">
               <Bell size={18} />
               <span>Alertes Expédition</span>
            </Link>
          </nav>

          <div className="p-6 border-t border-white/5">
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-300/60 hover:text-red-300 hover:bg-red-500/10 transition-all font-bold text-sm">
               <LogOut size={18} />
               <span>Déconnexion</span>
            </button>
          </div>
      </aside>

      <main className="pl-72 min-h-screen">
        <div className="px-12 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
