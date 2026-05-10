import React from 'react'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@sharufa/db'
import { Package } from 'lucide-react'
import { CargoDashboardMobile } from '@/components/dashboard/cargo/CargoDashboardMobile'
import { CargoDashboardDesktop } from '@/components/dashboard/cargo/CargoDashboardDesktop'

export default async function CargoDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch the cargo partner associated with this user
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { cargo: true }
  })

  if (!profile?.cargoId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Package size={64} className="text-slate-200" />
        <h2 className="text-2xl font-black text-primary uppercase">Accès restreint</h2>
        <p className="text-muted-foreground max-w-md">Votre compte n&apos;est rattaché à aucun partenaire logistique actif.</p>
      </div>
    )
  }

  // Fetch orders assigned to this cargo
  const orders = await prisma.order.findMany({
    where: { 
      cargoId: profile.cargoId,
      logisticsStatus: {
        in: ['DROPPED_AT_CARGO', 'RECEIVED_BY_CARGO', 'REJECTED_BY_CARGO', 'SHIPPED', 'IN_TRANSIT', 'READY_FOR_DELIVERY', 'DELIVERED']
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { firstName: true, lastName: true } },
      items: true
    }
  })

  // Fetch batches for Maritime
  const batches = profile?.cargo?.transportType === 'SEA'
    ? await prisma.shipmentBatch.findMany({
        where: { cargoId: profile.cargoId, status: { in: ['OPEN', 'SHIPPED'] } },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { orders: true } } }
      })
    : []

  const stats = {
    total: orders.length,
    inTransit: orders.filter(o => ['SHIPPED', 'IN_TRANSIT'].includes(o.logisticsStatus)).length,
    delivered: orders.filter(o => o.logisticsStatus === 'DELIVERED').length,
    pending: orders.filter(o => o.logisticsStatus === 'DROPPED_AT_CARGO' || o.logisticsStatus === 'RECEIVED_BY_CARGO').length
  }

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <CargoDashboardMobile 
          profile={profile}
          orders={orders}
          stats={stats}
          transportType={profile?.cargo?.transportType || 'AIR'}
          batches={batches}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <CargoDashboardDesktop 
          profile={profile}
          orders={orders}
          stats={stats}
          transportType={profile?.cargo?.transportType || 'AIR'}
          batches={batches}
        />
      </div>
    </>
  )
}
