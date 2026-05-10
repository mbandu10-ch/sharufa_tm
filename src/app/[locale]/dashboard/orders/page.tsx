import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function OrdersRedirectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile and shop
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  // 1. ADMIN Redirect (to seller view or admin orders if exists)
  if (profile?.role === 'ADMIN') {
    redirect('/admin/orders')
  }

  // 2. SELLER Redirect
  if (profile?.shop) {
    redirect('/dashboard/seller/orders')
  }

  // 3. Default: BUYER Redirect
  redirect('/dashboard/buyer/orders')
}

