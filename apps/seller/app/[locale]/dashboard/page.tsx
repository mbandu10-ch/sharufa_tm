import React from 'react'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@sharufa/db'
import { SellerDashboardMobile } from '@components/dashboard/seller/SellerDashboardMobile'
import { SellerDashboardDesktop } from '@components/dashboard/seller/SellerDashboardDesktop'

export default async function SellerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch complete profile and shop
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  let shop = profile?.shop
  if (!shop && profile?.role === 'ADMIN') {
    shop = await prisma.shop.findUnique({ where: { slug: 'sharufa-store' } })
  }

  if (!shop) return <div className="p-10 text-center font-bold">Boutique non trouvée</div>

  // Fetch Stats for Seller (Shop exists)
  const [productCount, orderCount, totalSales, documentCount, productStats] = await Promise.all([
    prisma.product.count({ where: { shopId: shop.id } }),
    prisma.orderItem.count({ where: { product: { shopId: shop.id } } }),
    prisma.orderItem.findMany({
      where: { 
        product: { shopId: shop.id },
        order: { status: { not: 'CANCELLED' } }
      }
    }),
    prisma.shopDocument.count({ where: { shopId: shop.id } }),
    prisma.product.groupBy({
      by: ['status'],
      where: { shopId: shop.id },
      _count: true
    })
  ])

  const stats = {
    approved: productStats.find(s => s.status === 'APPROVED')?._count || 0,
    pending: productStats.find(s => s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED')?._count || 0,
    rejected: productStats.find(s => s.status === 'REJECTED' || s.status === 'NEEDS_CORRECTION')?._count || 0,
  }

  const hasLegalProfile = !!(await prisma.shopLegalProfile.findUnique({
    where: { shopId: shop.id }
  }))

  // Fetch Relevant Sourcing Leads
  const sourcingLeads = await prisma.sourcingRequest.findMany({
    where: {
      status: 'NEW',
      categoryId: { in: shop.allowedCategoryIds }
    },
    include: {
      category: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 4
  })

  // Fetch Recent Orders for Seller
  const recentOrderItems = await prisma.orderItem.findMany({
    where: { product: { shopId: shop.id } },
    take: 10, // Fetch more to account for duplicates before grouping
    orderBy: { order: { createdAt: 'desc' } },
    include: {
      product: { select: { name: true } },
      order: {
        include: {
          client: { select: { firstName: true, lastName: true, email: true } },
          items: {
            where: { product: { shopId: shop.id } },
            include: { product: { select: { name: true } } }
          }
        }
      }
    }
  })

  // Group by unique order ID to avoid duplicates in the "Recent Orders" list
  const recentOrders = Array.from(new Set(recentOrderItems.map(item => item.order.id)))
    .map(id => {
      const orderData = recentOrderItems.find(item => item.order.id === id)!.order
      return orderData
    })
    .slice(0, 5) // Keep top 5 after grouping

  const totalSalesValue = (totalSales as any[]).reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const totalSalesFormatted = { _sum: { price: totalSalesValue } }

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <SellerDashboardMobile 
          profile={profile}
          shop={shop}
          stats={stats}
          productCount={productCount}
          orderCount={orderCount}
          totalSales={totalSalesFormatted}
          recentOrders={recentOrders}
          sourcingLeads={sourcingLeads}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <SellerDashboardDesktop 
          profile={profile}
          shop={shop}
          stats={stats}
          productCount={productCount}
          orderCount={orderCount}
          totalSales={totalSalesFormatted}
          recentOrders={recentOrders}
          sourcingLeads={sourcingLeads}
          hasLegalProfile={hasLegalProfile}
          documentCount={documentCount}
        />
      </div>
    </>
  )
}
