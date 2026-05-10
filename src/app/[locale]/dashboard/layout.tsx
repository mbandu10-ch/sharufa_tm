import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

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

  // 2. Safeguard for CARGO users (they have their own layout at /cargo)
  if (profile?.role === 'CARGO') {
    redirect('/cargo')
  }

  // 3. Suppression de la redirection de blocage pour les vendeurs en attente
  // On laisse l'accès au dashboard mais on affichera un bandeau informatif dans la page

  return (
    <DashboardShell profile={profile} hasShop={!!shop}>
      {children}
    </DashboardShell>
  )
}
