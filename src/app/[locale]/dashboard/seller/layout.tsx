import React from 'react'
import { SellerSidebar } from '@/components/dashboard/seller/SellerSidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch shop and profile
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  const shop = profile?.shop

  // Security check: Redirect if not a vendor or no shop
  if (!shop && profile?.role === 'VENDOR') {
    redirect('/seller') // Onboarding
  }

  if (!shop && profile?.role !== 'ADMIN') {
    redirect('/dashboard/buyer')
  }

  return (
    <>
      {children}
    </>
  )
}
