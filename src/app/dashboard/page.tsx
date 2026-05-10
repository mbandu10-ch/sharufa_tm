import React from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/dashboard/StatCard'
import { RecentOrders } from '@/components/dashboard/RecentOrders'
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist'
import { ProductStatusBreakdown } from '@/components/dashboard/ProductStatusBreakdown'
import { SourcingLeadsFeed } from '@/components/dashboard/SourcingLeadsFeed'
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  Store,
  AlertCircle,
  Clock,
  ShieldAlert
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch complete profile and shop
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  // REDIRECT ADMINS to global admin dashboard
  if ((profile?.role as string) === 'ADMIN') {
    redirect('/admin')
  }

  // If no shop but ADMIN, find the official shop or show a general view
  let shop = profile?.shop
  if (!shop && profile?.role === 'ADMIN') {
    shop = await prisma.shop.findUnique({ where: { slug: 'sharufa-store' } })
  }

  if (!shop) {
    // Fetch Buyer Stats
    const [orderCount, sourcingCount, totalSpent] = await Promise.all([
      prisma.order.count({ where: { clientId: user.id } }),
      prisma.sourcingRequest.count({ where: { clientId: user.id } }),
      prisma.order.aggregate({
        where: { clientId: user.id, status: { in: ['CONFIRMED', 'DELIVERED', 'SHIPPED'] } },
        _sum: { totalAmount: true }
      })
    ])


    const recentOrders = await prisma.order.findMany({
      where: { clientId: user.id },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    return (
      <div className="space-y-10 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                   Espace Acheteur
                 </span>
              </div>
              <h1 className="text-5xl font-black font-outfit text-primary tracking-tighter leading-none">
                 Bonjour, <span className="text-secondary italic">{profile?.firstName || 'Client'}</span>
              </h1>
              <p className="text-muted-foreground text-lg font-medium">Suivez vos achats et demandes de sourcing en temps réel.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <StatCard 
              title="Mes Commandes" 
              value={orderCount} 
              iconName="shopping-bag" 
              description="Total des achats effectués"
              color="primary"
           />
           <StatCard 
              title="Mes Sourcing" 
              value={sourcingCount} 
              iconName="package" 
              description="Demandes d'importation"
              color="secondary"
           />
           <StatCard 
              title="Total Dépensé" 
              value={`${(totalSpent?._sum?.totalAmount || 0).toLocaleString()} CFA`} 
              iconName="trending-up" 
              description="Volume d'achat total"
              color="blue"
           />

        </div>

        <div className="grid grid-cols-1 gap-10">
           <RecentOrders orders={recentOrders as any} />
        </div>
      </div>
    )
  }

  // Fetch Stats for Seller (Shop exists)
  const [productCount, orderCount, totalSales, documentCount, productStats] = await Promise.all([
    prisma.product.count({ where: { shopId: shop.id } }),
    prisma.orderItem.count({ where: { product: { shopId: shop.id } } }),
    prisma.orderItem.aggregate({
      where: { product: { shopId: shop.id } },
      _sum: { price: true }
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
    take: 5,
    orderBy: { order: { createdAt: 'desc' } },
    include: {
      order: {
        include: {
          client: { select: { firstName: true, lastName: true, email: true } }
        }
      }
    }
  })

  const recentOrders = Array.from(new Set(recentOrderItems.map(item => item.order.id)))
    .map(id => recentOrderItems.find(item => item.order.id === id)!.order)

  return (
    <div className="space-y-10 max-w-7xl">
      {/* 0. Pending Approval Banner */}
      {shop.status !== 'APPROVED' && (
        <div className={cn(
          "relative overflow-hidden rounded-[40px] p-8 md:p-12 border shadow-2xl flex flex-col md:flex-row items-center gap-8 group mb-12",
          shop.status === 'REJECTED' 
            ? "bg-red-50 border-red-100 text-red-900" 
            : "bg-amber-50 border-amber-100 text-amber-900"
        )}>
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center shrink-0",
            shop.status === 'REJECTED' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
          )}>
            {shop.status === 'REJECTED' ? <ShieldAlert size={40} /> : <Clock size={40} className="animate-pulse" />}
          </div>
          <div className="space-y-3 text-center md:text-left flex-1">
             <h3 className="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tighter">
                {shop.status === 'REJECTED' ? 'Demande Refusée' : 'Boutique en cours de vérification'}
             </h3>
             <p className="text-lg font-bold opacity-70 leading-relaxed max-w-2xl">
                {shop.status === 'REJECTED' 
                  ? "Votre demande d'ouverture de boutique n'a pas été acceptée. Veuillez contacter le support pour plus d'informations ou consulter vos emails."
                  : "Bienvenue sur votre espace vendeur ! Vos produits et votre boutique seront visibles par les clients dès que notre équipe aura validé votre documentation (sous 48h)."}
             </p>
          </div>
          <Button asChild variant="outline" className="rounded-full px-8 h-14 font-black border-2 bg-white/50 backdrop-blur-sm">
             <Link href="/seller/register">Voir les détails</Link>
          </Button>
        </div>
      )}

      {/* 0.5. Onboarding Checklist for Pending/Under Review Shops */}
      {(shop.status === 'PENDING' || shop.status === 'UNDER_REVIEW') && (
        <OnboardingChecklist 
          shopId={shop.id}
          hasLegalProfile={hasLegalProfile}
          documentCount={documentCount}
          productCount={productCount}
          hasLogo={!!shop.logo}
        />
      )}

      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                 Dashboard Vendeur
               </span>
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono">
                 {shop.name}
               </span>
            </div>
            <h1 className="text-5xl font-black font-outfit text-primary tracking-tighter leading-none">
               Bonjour, <span className="text-secondary italic">{profile?.firstName || 'Partenaire'}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">Voici l&apos;état actuel de vos opérations chez Sharufa.</p>
            
            {/* Product Breakdown */}
            <div className="pt-2">
               <ProductStatusBreakdown 
                 approved={stats.approved}
                 pending={stats.pending}
                 rejected={stats.rejected}
               />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="rounded-full border-2 border-slate-100 px-6 h-14 font-bold text-primary hover:bg-slate-50">
               <Link href={`/shop/${shop.slug}`} target="_blank">
                  Voir ma boutique <ArrowUpRight className="ml-2" size={18} />
               </Link>
            </Button>
            <Button asChild className="rounded-full bg-primary text-white h-14 px-8 font-black shadow-2xl shadow-primary/20 group">
               <Link href="/dashboard/products/new">
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" /> Nouveau Produit
               </Link>
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <StatCard 
            title="Produits Actifs" 
            value={productCount} 
            iconName="package" 
            description="Articles actuellement en ligne"
            color="primary"
         />
         <StatCard 
            title="Commandes Reçues" 
            value={orderCount} 
            iconName="shopping-bag" 
            description="Volumes de transactions"
            color="secondary"
         />
         <StatCard 
            title="Volume de Vente" 
            value={`${(totalSales._sum.price || 0).toLocaleString()} CFA`} 
            iconName="trending-up" 
            description="Chiffre d&apos;affaires total"
            color="blue"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2">
            <RecentOrders orders={recentOrders as any} />
         </div>
         <div className="lg:col-span-1">
            <SourcingLeadsFeed 
               leads={sourcingLeads as any} 
               shopType={shop.type} 
            />
         </div>
      </div>
    </div>
  )
}

