import React from 'react'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { redirect } from 'next/navigation'
import { prisma } from '@sharufa/db'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

/**
 * Layout du Dashboard Client (apps/web)
 * - Gère uniquement les CLIENTS et les Vendeurs accédant à leur profil acheteur.
 * - Redirige les rôles spécialisés vers leurs portails respectifs.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_PORTAL_URL || 'https://login.sharufa.com'
    redirect(`${authUrl}/login?next=${encodeURIComponent('https://sharufa.com/dashboard')}`)
  }

  // Récupérer le profil complet
  const profile = await prisma.profile.findUnique({ 
    where: { id: user.id },
    include: { shop: true }
  })

  // REDIRECTIONS VERS LES PORTAILS STANDALONE SI NÉCESSAIRE
  
  // 1. ADMIN -> admin.sharufa.com
  if (profile?.role === 'ADMIN') {
    redirect(process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'https://admin.sharufa.com')
  }

  // 2. CARGO -> cargo.sharufa.com
  if (profile?.role === 'CARGO') {
    redirect(process.env.NEXT_PUBLIC_CARGO_PORTAL_URL || 'https://cargo.sharufa.com')
  }

  // 3. SELLER -> seller.sharufa.com (Si accès aux routes seller via dashboard web)
  // Note: On laisse l'accès au dashboard client même pour les vendeurs (pour leurs propres achats)

  return (
    <DashboardShell profile={profile} hasShop={!!profile?.shop}>
      <div className="px-4 md:px-8 py-6">
        {children}
      </div>
    </DashboardShell>
  )
}
