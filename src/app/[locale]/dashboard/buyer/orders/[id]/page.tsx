import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock,
  Warehouse
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getBuyerStatusLabel } from '@/lib/order-status-config'
import { getProductSpecs, isVehicle } from '@/lib/product-utils'
import { Calendar, Gauge, Fuel, Activity } from 'lucide-react'

export default async function BuyerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { include: { shop: true } }
        }
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!order || order.clientId !== user.id) {
    notFound()
  }

  const statusLabel = getBuyerStatusLabel(order.logisticsStatus)

  const steps = [
    { id: 'PREPARING', label: 'En préparation', statuses: ['NEW_ORDER', 'TO_PREPARE', 'READY_FOR_DROPOFF', 'DROPPED_AT_CARGO'], icon: Clock },
    { id: 'AT_CARGO', label: 'Livré au cargo', statuses: ['RECEIVED_BY_CARGO', 'VERIFIED_COMPLIANT'], icon: Warehouse },
    { id: 'SHIPPED', label: 'En transit', statuses: ['SHIPPED', 'IN_TRANSIT'], icon: Truck },
    { id: 'DELIVERED', label: 'Livré', statuses: ['READY_FOR_DELIVERY', 'DELIVERED'], icon: CheckCircle2 },
  ]

  const currentStepIdx = steps.findIndex(step => step.statuses.includes(order.logisticsStatus))

  return (
    <div className="space-y-10 max-w-7xl pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/buyer/orders" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">Détail Commande</div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter italic">#{order.orderNumber}</h1>
          </div>
        </div>
        <Badge className="px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest bg-secondary text-primary border-none">
          {statusLabel}
        </Badge>
      </div>

      {/* Stepper Tracking */}
      <Card className="rounded-[40px] border-none shadow-sm bg-white p-10">
        <div className="flex items-center justify-between relative max-w-4xl mx-auto">
          {steps.map((step, idx) => {
            const isCompleted = currentStepIdx > idx || order.logisticsStatus === 'DELIVERED'
            const isCurrent = currentStepIdx === idx
            const Icon = step.icon

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-3xl flex items-center justify-center border-4 transition-all duration-500",
                    isCompleted ? "bg-secondary border-secondary text-primary" : 
                    isCurrent ? "bg-white border-primary text-primary animate-pulse shadow-xl shadow-primary/10" : 
                    "bg-white border-slate-100 text-slate-300"
                  )}>
                    <Icon size={24} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest text-center max-w-[80px]",
                    isCurrent || isCompleted ? "text-primary" : "text-slate-400"
                  )}>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-1 bg-slate-100 mx-4 -mt-10 relative">
                    <div 
                      className="absolute inset-0 bg-secondary transition-all duration-1000" 
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100">
               <div className="flex items-center gap-3">
                  <Package className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Articles commandés</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                     {order.items.map((item) => (
                        <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 shadow-inner">
                                    <img src={item.product.images[0] || 'https://via.placeholder.com/150'} alt="p" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <div className="text-sm font-black text-primary uppercase">{item.product.name}</div>
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{item.product.shop?.name}</div>
                                    
                                    {/* Product Specs */}
                                    {(() => {
                                       const specs = getProductSpecs(item.product.attributes)
                                       if (!specs) return null
                                       
                                       return (
                                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                             {specs.year && (
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                   <Calendar size={10} className="text-secondary" />
                                                   <span className="text-[9px] font-bold uppercase tracking-tighter">{specs.year}</span>
                                                </div>
                                             )}
                                             {specs.mileage && (
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                   <Gauge size={10} className="text-secondary" />
                                                   <span className="text-[9px] font-bold uppercase tracking-tighter">{Number(specs.mileage).toLocaleString()} km</span>
                                                </div>
                                             )}
                                             {specs.fuel && (
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                   <Fuel size={10} className="text-secondary" />
                                                   <span className="text-[9px] font-bold uppercase tracking-tighter">{specs.fuel}</span>
                                                </div>
                                             )}
                                             {specs.transmission && (
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                   <Activity size={10} className="text-secondary" />
                                                   <span className="text-[9px] font-bold uppercase tracking-tighter">{specs.transmission}</span>
                                                </div>
                                             )}
                                          </div>
                                       )
                                    })()}
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6 text-center text-sm font-black text-primary">
                              x{item.quantity}
                           </td>
                           <td className="px-10 py-6 text-right text-sm font-black text-primary italic">
                              {(item.price * item.quantity).toLocaleString()} {order.currency}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               <div className="p-10 flex flex-col items-end gap-2 bg-slate-50/20 border-t border-slate-50">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Payé</div>
                  <div className="text-3xl font-black text-primary italic">{order.totalAmount.toLocaleString()} {order.currency}</div>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 pb-2 italic">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <MapPin size={16} className="text-secondary" /> Livraison
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4">
               <div className="text-sm font-bold text-primary leading-tight italic">
                  {order.shippingAddress}
               </div>
            </CardContent>
          </Card>

          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
             <CardHeader className="p-8 pb-2 italic">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <Clock size={16} className="text-secondary" /> Date de commande
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-4">
                <div className="text-sm font-bold text-primary italic">
                   {format(new Date(order.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
