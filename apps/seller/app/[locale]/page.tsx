import React from 'react'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@sharufa/db'
import SellerLandingUI from '@root/components/seller/SellerLandingUI'

export default async function SellerLandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let shopStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' = 'NONE'

  if (user) {
    const shop = await (prisma.shop as any).findUnique({
      where: { ownerId: user.id },
      select: { status: true }
    })
    
    if (shop) {
      shopStatus = shop.status
    }
  }

  return <SellerLandingUI shopStatus={shopStatus} />
}
