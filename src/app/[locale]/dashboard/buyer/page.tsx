import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { BuyerDashboardMobile } from '@/components/dashboard/buyer/BuyerDashboardMobile'
import { BuyerDashboardDesktop } from '@/components/dashboard/buyer/BuyerDashboardDesktop'

export default async function BuyerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  })

  // Fetch Buyer Stats
  const [orderCount, sourcingCount, totalSpent] = await Promise.all([
    prisma.order.count({ where: { clientId: user.id } }),
    prisma.sourcingRequest.count({ where: { clientId: user.id } }),
    prisma.order.aggregate({
      where: { clientId: user.id, status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true }
    })
  ])

  const [recentOrders, recentSourcing] = await Promise.all([
    prisma.order.findMany({
      where: { clientId: user.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { 
        client: true,
        items: {
          include: {
            product: true
          }
        }
      }
    }),
    prisma.sourcingRequest.findMany({
      where: { clientId: user.id },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ])

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <BuyerDashboardMobile 
          profile={profile}
          orderCount={orderCount}
          sourcingCount={sourcingCount}
          totalSpent={totalSpent}
          recentOrders={recentOrders}
          recentSourcing={recentSourcing}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <BuyerDashboardDesktop 
          profile={profile}
          orderCount={orderCount}
          sourcingCount={sourcingCount}
          totalSpent={totalSpent}
          recentOrders={recentOrders}
          recentSourcing={recentSourcing}
        />
      </div>
    </>
  )
}
