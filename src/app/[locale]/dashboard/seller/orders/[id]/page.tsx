import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Truck, 
  Clock,
  Warehouse,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LogisticsActionButton } from '@/components/dashboard/LogisticsActionButton'

export default async function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: true,
      cargo: true,
      items: {
        include: {
          product: true
        }
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' },
        include: { 
          changedBy: {
            include: {
              shop: true,
              cargo: true
            }
          } 
        }
      }
    }
  })

  if (!order) {
    notFound()
  }

  // Security check
  const isActualSeller = profile?.shop?.id === order.shopId
  const isAdmin = profile?.role === 'ADMIN'

  if (!isActualSeller && !isAdmin) {
    redirect('/dashboard/buyer/orders')
  }

  const logisticsStatusMapping: Record<string, { label: string, color: string, icon?: any }> = {
    NEW_ORDER: { label: 'À expédier', color: 'bg-blue-100 text-blue-700', icon: Clock },
    DROPPED_AT_CARGO: { label: 'Envoyé au cargo', color: 'bg-emerald-100 text-emerald-700', icon: Truck },
    RECEIVED_BY_CARGO: { label: 'Reçu par cargo', color: 'bg-emerald-100 text-emerald-800', icon: Package },
    REJECTED_BY_CARGO: { label: 'Non-conforme', color: 'bg-rose-100 text-rose-700', icon: AlertTriangle },
    SHIPPED: { label: 'En transit', color: 'bg-purple-100 text-purple-700', icon: Truck },
    DELIVERED: { label: 'Livré', color: 'bg-green-100 text-green-800', icon: Package },
  }

  const currentStatus = logisticsStatusMapping[order.logisticsStatus] || { label: order.logisticsStatus, color: 'bg-slate-100 text-slate-700' }

  return (
    <div className="space-y-10 max-w-7xl pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/seller/orders" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">Vente Directe</div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter italic">#{order.orderNumber}</h1>
          </div>
        </div>
        
        <Badge className={cn("px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest border-none self-start flex items-center gap-2", currentStatus.color)}>
           {currentStatus.icon && <currentStatus.icon size={14} />}
           {currentStatus.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {order.logisticsStatus === 'REJECTED_BY_CARGO' && (
             <div className="bg-rose-50 border-2 border-rose-100 rounded-[40px] p-8 flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                   <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-sm font-black text-rose-900 uppercase italic">Commande Non-Conforme</h3>
                   <p className="text-xs font-bold text-rose-700 leading-relaxed italic">
                      Le cargo a retourné cette commande. Veuillez corriger le problème et cliquer sur &quot;Commande corrigée&quot;.
                   </p>
                </div>
             </div>
          )}

          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100">
               <div className="flex items-center gap-3">
                  <Package className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Détail des articles</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                     {order.items.map((item) => (
                        <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors italic">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                    <img src={item.product.images[0] || 'https://via.placeholder.com/150'} alt="p" className="w-full h-full object-cover" />
                                 </div>
                                 <div className="space-y-1">
                                    <div className="text-sm font-black text-primary uppercase">{item.product.name}</div>
                                    {/* Affichage des détails réels (Attributs) */}
                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                       {item.product.attributes && Object.entries(item.product.attributes as any).map(([key, value]) => {
                                          if (!value || ['description', 'images'].includes(key)) return null;
                                          return (
                                             <div key={key} className="text-[10px] flex items-center gap-1">
                                                <span className="text-muted-foreground font-bold uppercase">{key}:</span>
                                                <span className="text-primary font-black uppercase">{String(value)}</span>
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6 text-center text-sm font-black text-primary">
                              x{item.quantity}
                           </td>
                           <td className="px-10 py-6 text-right text-sm font-black text-primary italic">
                              {item.price.toLocaleString()} {order.currency}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white italic">
             <CardHeader className="p-10 pb-0">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Historique Opérationnel</CardTitle>
             </CardHeader>
             <CardContent className="p-10 space-y-8">
                {order.statusHistory.map((history, idx) => (
                   <div key={history.id} className="flex gap-6 relative">
                      {idx < order.statusHistory.length - 1 && (
                         <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-100" />
                      )}
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10 shrink-0",
                        idx === 0 ? "border-secondary" : "border-slate-100"
                      )}>
                        <div className={cn("w-2 h-2 rounded-full", idx === 0 ? "bg-secondary" : "bg-slate-200")} />
                      </div>
                       <div className="space-y-1 flex-1">
                          <div className="text-[11px] font-black text-primary uppercase flex items-center justify-between gap-4">
                             <span>{history.new.replace(/_/g, ' ')}</span>
                             <span className="text-[9px] font-bold text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                                {format(new Date(history.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                             </span>
                          </div>
                          
                          <div className="text-[10px] font-bold bg-secondary/5 text-secondary border border-secondary/10 px-3 py-1.5 rounded-lg inline-block italic">
                             {(() => {
                                const actorName = history.changedByRole === 'VENDOR' ? history.changedBy.shop?.name :
                                                  history.changedByRole === 'CARGO' ? history.changedBy.cargo?.name :
                                                  history.changedByRole === 'ADMIN' ? 'Administrateur Sharufa' :
                                                  'Utilisateur';
                                return `${actorName} Action : ${history.new.replace(/_/g, ' ')}`;
                             })()}
                          </div>
                       </div>
                   </div>
                ))}
             </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 pb-2 italic">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action Requise</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4">
               <LogisticsActionButton 
                 orderId={order.id} 
                 currentStatus={order.logisticsStatus} 
               />
            </CardContent>
          </Card>

          {order.cargo && (
             <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
                <CardHeader className="p-8 pb-2 italic">
                   <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Logistique Assignée</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-4 italic">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-secondary border border-slate-100">
                         <Warehouse size={18} />
                      </div>
                      <div className="text-sm font-black text-primary uppercase">{order.cargo.name}</div>
                   </div>
                   <div className="text-[10px] text-muted-foreground flex items-start gap-2">
                      <MapPin size={12} className="shrink-0 mt-0.5" />
                      {order.cargo.warehouseAddress}
                   </div>
                </CardContent>
             </Card>
          )}

          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
             <CardHeader className="p-8 pb-2 italic">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Informations Client</CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-4 space-y-1 text-center italic">
                <div className="text-sm font-black text-primary uppercase">Acheteur #{order.clientId.slice(-4)}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">{order.destinationCountry}</div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
