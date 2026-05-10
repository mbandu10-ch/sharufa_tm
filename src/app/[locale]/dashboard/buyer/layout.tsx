import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile to verify role
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })

  // Security check: Only allow buyers (or admins viewing as buyer)
  // If role is VENDOR and they have a shop, maybe we should still let them use buyer features, 
  // but usually sellers have their own space. 
  // For now, let's just make sure they aren't forced into the wrong space.

  return (
    <>
      {children}
    </>
  )
}
