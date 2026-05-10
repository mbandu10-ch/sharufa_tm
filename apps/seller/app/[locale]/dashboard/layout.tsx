import React from 'react'
import { SellerSidebar } from '@/components/dashboard/SellerSidebar'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { redirect } from 'next/navigation'
import { prisma } from '@sharufa/db' // Utilisation du package db

export default async function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirection vers le portail d'auth centralisé si pas de session
    // Normalement géré par le middleware, mais double sécurité
    redirect('https://login.sharufa.com/login')
  }

  // Fetch shop and profile
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  // Security check: Redirect if not a vendor or admin
  if (profile?.role !== 'VENDOR' && profile?.role !== 'ADMIN') {
    // Rediriger vers l'app principale pour les clients
    redirect('https://sharufa.com/dashboard')
  }

  const shop = profile?.shop

  // Si c'est un vendeur mais sans boutique, rediriger vers onboarding
  if (!shop && profile?.role === 'VENDOR') {
    redirect('/') // Onboarding sur le domaine seller.sharufa.com
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Desktop */}
      <SellerSidebar profile={profile} hasShop={!!shop} />
      
      <main className="flex-1 lg:ml-72 min-h-screen bg-slate-50 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
