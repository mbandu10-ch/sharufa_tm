import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  MapPin, 
  Calendar,
  Eye,
  Truck,
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
    where: { cargoId: profile.cargoId },
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { firstName: true, lastName: true } },
      items: true
    }
  })

  const stats = {
    total: orders.length,
    inTransit: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    pending: orders.filter(o => o.status === 'READY_TO_SHIP' || o.status === 'PROCESSING').length
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter italic uppercase">
               Pilotage des Flux <span className="text-secondary italic">Logistiques</span>
            </h1>
            <p className="text-muted-foreground font-medium">Gestion des expéditions pour la route {profile.cargo?.originCountry} → {profile.cargo?.destinationCountry}</p>
         </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Total Commandes</div>
            <div className="text-3xl font-black text-primary italic">{stats.total}</div>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4">À Préparer</div>
            <div className="text-3xl font-black text-primary italic">{stats.pending}</div>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4">En Transit</div>
            <div className="text-3xl font-black text-primary italic">{stats.inTransit}</div>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-4">Livrées</div>
            <div className="text-3xl font-black text-primary italic">{stats.delivered}</div>
         </div>
      </div>

      {/* Orders Table */}
      <Card className="border-none shadow-sm bg-white rounded-[40px] overflow-hidden">
         <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Manifeste de Transport</h3>
            <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-black tracking-widest px-6 h-10 border-slate-100">
               Actualiser
            </Button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commande</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Client</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destination</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Articles</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Statut</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-10 py-20 text-center text-muted-foreground italic">
                        Aucune commande assignée pour le moment.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/30 transition-colors italic group">
                         <td className="px-10 py-6">
                            <span className="text-sm font-black text-primary uppercase">#{order.orderNumber}</span>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                               {format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="text-sm font-black text-primary uppercase">{order.client.firstName} {order.client.lastName}</div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-primary italic">
                               <MapPin size={12} className="text-secondary" />
                               {order.destinationCountry}
                            </div>
                         </td>
                         <td className="px-10 py-6 text-xs font-bold text-slate-500">
                            {order.items.length} positions
                         </td>
                         <td className="px-10 py-6">
                            <Badge variant="outline" className={cn(
                               "rounded-full font-black uppercase text-[9px] tracking-widest py-1 px-4 border-none shadow-sm",
                               order.status === 'DELIVERED' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                            )}>
                               {order.status}
                            </Badge>
                         </td>
                         <td className="px-10 py-6 text-right">
                            <Button asChild variant="outline" className="rounded-xl h-10 px-4 border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                               <Link href={`/cargo/orders/${order.id}`}>
                                  Suivi <ArrowRight size={14} className="ml-2" />
                                </Link>
                            </Button>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  )
}
