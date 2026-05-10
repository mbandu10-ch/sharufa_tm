import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@sharufa/db'
import { redirect } from 'next/navigation'

export default async function SettingsRedirectPage() {
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
    redirect('/admin/settings')
  }

  // 2. SELLER Redirect
  if (profile?.shop) {
    redirect('/dashboard/seller/settings')
  }

  // 3. Default: BUYER Redirect
  redirect('/dashboard/buyer/settings')
}
