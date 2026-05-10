import React from 'react'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Vérifier si l'utilisateur a une boutique
  const shop = await prisma.shop.findUnique({
    where: { ownerId: user.id }
  })

  // Récupérer le profil complet
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })

  // 1. Redirection pour les vendeurs potentiels (rôle VENDOR mais pas de boutique)
  if (!shop && profile?.role === 'VENDOR') {
    redirect('/seller')
  }

  // 2. Suppression de la redirection de blocage pour les vendeurs en attente
  // On laisse l'accès au dashboard mais on affichera un bandeau informatif dans la page



  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar profile={profile} hasShop={!!shop} />
      <main className="pl-72 min-h-screen">

        <div className="px-12 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
