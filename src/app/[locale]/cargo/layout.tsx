import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Loader2 } from 'lucide-react'
import ForcePasswordReset from '@/components/cargo/ForcePasswordReset'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

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

  // FORCE PASSWORD CHANGE (OVERLAY)
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
      {children}
    </DashboardShell>
  )
}
