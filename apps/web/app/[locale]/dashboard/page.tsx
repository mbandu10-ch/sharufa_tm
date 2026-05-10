import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@sharufa/db'
import { redirect } from 'next/navigation'

export default async function DashboardRedirectPage() {
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

  // 1. ADMIN Redirect
  if (profile?.role === 'ADMIN') {
    redirect('/admin')
  }

  // 2. SELLER Redirect (If they have a shop and it's not rejected)
  if (profile?.shop) {
    redirect('/dashboard/seller')
  }

  // 3. VENDOR without shop (Onboarding)
  if (profile?.role === 'VENDOR') {
    redirect('/seller')
  }

  // 4. CARGO Redirect
  if (profile?.role === 'CARGO') {
    redirect('/cargo')
  }

  // 5. Default: BUYER Redirect
  redirect('/dashboard/buyer')
}

