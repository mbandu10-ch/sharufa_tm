import React from 'react'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { redirect } from 'next/navigation'
import { prisma } from '@sharufa/db'
import { Loader2 } from 'lucide-react'
import ForcePasswordReset from '@/components/cargo/ForcePasswordReset'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

/**
 * Layout sécurisé pour les partenaires Logistique (CARGO) Standalone
 * 1. Middleware (proxy.ts) -> Vérifie Auth
 * 2. Ce layout -> Vérifie Role CARGO + Force Password Reset
 */
export default async function CargoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('https://login.sharufa.com/login')
  }

  // Vérifier si l'utilisateur est un CARGO dans la base centrale
  const profile = await prisma.profile.findUnique({ 
    where: { id: user.id },
    include: { cargo: true }
  })
  
  // GARDE DE RÔLE : Seuls les agents CARGO (et ADMIN pour supervision) sont autorisés
  if (profile?.role !== 'CARGO' && profile?.role !== 'ADMIN') {
    // Redirection vers le marketplace principal pour les clients/vendeurs
    redirect('https://sharufa.com/dashboard')
  }

  // FORCE PASSWORD CHANGE (OVERLAY SÉCURITÉ)
  // Obligatoire pour tous les nouveaux comptes agents créés par l'admin
  if (profile?.mustChangePassword) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ForcePasswordReset />
        <main className="w-full h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary opacity-20" size={40} />
        </main>
      </div>
    )
  }

  return (
    <DashboardShell profile={profile} hasShop={false}>
      <div className="px-4 md:px-8 py-6">
        {children}
      </div>
    </DashboardShell>
  )
}
