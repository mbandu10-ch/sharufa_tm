import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Truck, 
  ShoppingBag, 
  Calendar, 
  Info,
  Clock,
  CheckCircle2,
  Warehouse
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: true,
      shop: true,
      cargo: true,
      items: {
        include: {
          product: true
        }
      },
      events: {
        orderBy: { createdAt: 'desc' }
      },
      trackingEvents: {
        orderBy: { createdAt: 'desc' },
        include: { createdBy: true }
      },
      qualityCheck: {
        include: { media: true }
      },
      shipmentBatch: true
    }
  })

  if (!order) {
    notFound()
  }

  // Fetch complete profile and shop for role check
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  // Security Check: User must be buyer, shop owner, or admin
  const isBuyer = order.clientId === user.id
  const isActualSeller = profile?.shop?.id === order.shopId
  const isAdmin = profile?.role === 'ADMIN'

  if (!isBuyer && !isActualSeller && !isAdmin) {
    redirect('/dashboard/orders')
  }

  const statusConfig: Record<string, { label: string, color: string }> = {
    NEW: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700' },
    CONFIRMED: { label: 'Confirmé', color: 'bg-indigo-100 text-indigo-700' },
    PROCESSING: { label: 'Traitement', color: 'bg-amber-100 text-amber-700' },
    READY_TO_SHIP: { label: 'Prêt à expédier', color: 'bg-sky-100 text-sky-700' },
    SHIPPED: { label: 'Expédié', color: 'bg-purple-100 text-purple-700' },
    DELIVERED: { label: 'Livré', color: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
    ISSUE: { label: 'Problème', color: 'bg-rose-100 text-rose-700' },
  }

  const currentStatus = statusConfig[order.status] || { label: order.status, color: 'bg-slate-100 text-slate-700' }

  return (
    <div className="space-y-10 max-w-7xl pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/orders" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 italic">
              {isActualSeller ? 'Gestion des Ventes' : 'Suivi de Commande'}
            </div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter italic">#{order.orderNumber}</h1>
          </div>
        </div>
        
        <Badge className={cn("px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest border-none self-start", currentStatus.color)}>
          {currentStatus.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* SELLER INSTRUCTIONS (Phase 3) */}
          {isActualSeller && order.cargo && (
             <div className="bg-secondary/5 border-2 border-secondary/20 rounded-[40px] p-8 md:p-10 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
                <div className="relative z-10 flex items-start gap-6">
                   <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center text-primary shadow-xl shadow-secondary/20">
                      <Warehouse size={32} />
                   </div>
                   <div className="flex-1 space-y-4">
                      <div>
                         <h3 className="text-lg font-black text-primary uppercase tracking-tight italic">Instructions d&apos;expédition</h3>
                         <p className="text-sm font-bold text-muted-foreground leading-relaxed mt-1">
                            Votre commande est rattachée à la route : <span className="text-primary font-black italic">{order.originCountry} → {order.destinationCountry}</span>.
                            Veuillez déposer le colis au Hub logistique Sharufa ci-dessous.
                         </p>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-secondary/10 shadow-sm">
                         <div className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Entrepôt de dépôt unique :</div>
                         <div className="text-base font-black text-primary mb-1">{order.cargo.name}</div>
                         <div className="flex items-start gap-2 text-sm font-bold text-slate-600 italic">
                            <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                            {order.cargo.warehouseAddress}
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase bg-white/40 border border-secondary/5 px-4 py-2 rounded-full w-fit">
                         <CheckCircle2 size={12} /> Traçabilité Sharufa activée
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* QC FAILED ALERT FOR SELLER */}
          {isActualSeller && order.qualityCheck?.status === 'FAILED' && (
             <div className="bg-destructive/5 border-2 border-destructive/20 rounded-[40px] p-8 md:p-10 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
                   <div className="w-16 h-16 rounded-3xl bg-destructive flex items-center justify-center text-white shadow-xl shadow-destructive/20 shrink-0">
                      <Info size={32} />
                   </div>
                   <div className="flex-1 space-y-4">
                      <div>
                         <h3 className="text-lg font-black text-destructive uppercase tracking-tight italic">Litige : Contrôle Qualité Échoué</h3>
                         <p className="text-sm font-bold text-destructive/80 leading-relaxed mt-1">
                            L'opérateur logistique a refusé l'expédition. Motif : {order.qualityCheck.notes || "Non spécifié."}
                         </p>
                      </div>
                      {order.qualityCheck.media.length > 0 && (
                         <div className="flex flex-wrap gap-4 pt-2">
                           {order.qualityCheck.media.map(m => (
                              <img key={m.id} src={m.fileUrl} className="w-24 h-24 object-cover rounded-2xl border-2 border-destructive/20 shadow-sm" alt="Preuve" />
                           ))}
                         </div>
                      )}
                      <Button variant="destructive" className="mt-2 rounded-xl font-bold">Contacter le support</Button>
                   </div>
                </div>
             </div>
           )}

          {/* Items */}
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
               <div className="flex items-center gap-3">
                  <Package className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Articles de la commande</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-50">
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Produit</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Quantité</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Prix</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {order.items.map((item) => (
                        <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors italic">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shadow-inner">
                                    <img src={item.product.images[0] || 'https://via.placeholder.com/150'} alt="p" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <div className="text-sm font-black text-primary uppercase line-clamp-1">{item.product.name}</div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                       <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Ref: {item.product.reference || 'N/A'}</div>
                                       {item.selectedSize && (
                                          <div className="text-[10px] text-secondary font-black uppercase tracking-widest bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 shadow-sm">
                                             Taille: {item.selectedSize}
                                          </div>
                                       )}
                                       {item.selectedColor && (
                                          <div className="text-[10px] text-secondary font-black uppercase tracking-widest bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 shadow-sm">
                                             Couleur: {item.selectedColor}
                                          </div>
                                       )}
                                    </div>
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
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total de la commande</div>
                  <div className="text-3xl font-black text-primary italic">{order.totalAmount.toLocaleString()} {order.currency}</div>
               </div>
            </CardContent>
          </Card>

          {/* QC APPROVED SHOWCASE FOR BUYER */}
          {isBuyer && order.qualityCheck?.status === 'APPROVED' && order.qualityCheck.media.length > 0 && (
             <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-green-50/50">
               <CardHeader className="px-10 py-6 border-b border-green-100 italic">
                  <div className="flex items-center gap-3">
                     <CheckCircle2 className="text-green-600" size={20} />
                     <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-green-900 italic">Votre commande en images</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-10 space-y-6">
                  <p className="text-sm font-bold text-green-800/80 leading-relaxed italic">
                     Nous avons certifié la conformité de votre colis avant son expédition internationale. Voici les photos prises au Hub Logistique :
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {order.qualityCheck.media.map(m => (
                       <div key={m.id} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-md">
                         <img src={m.fileUrl} className="w-full h-full object-cover" alt="Inspection Qualité" />
                       </div>
                    ))}
                  </div>
                  {order.qualityCheck.notes && (
                     <div className="text-xs font-bold text-green-900/60 p-4 bg-green-100/50 rounded-2xl italic border border-green-200/50">
                        Note: "{order.qualityCheck.notes}"
                     </div>
                  )}
               </CardContent>
             </Card>
          )}

          {/* Tracking Timeline (Phase 4) */}
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
               <div className="flex items-center gap-3">
                  <Truck className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Suivi Logistique en Temps Réel</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-10">
               {order.trackingEvents.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground italic flex flex-col items-center gap-4">
                     <Clock size={40} className="text-slate-200" />
                     <p className="text-sm font-bold uppercase tracking-widest opacity-50">Aucun événement logistique enregistré.</p>
                     <p className="text-xs max-w-xs leading-relaxed">Le tracking débutera dès que le colis sera reçu par notre transporteur partenaire.</p>
                  </div>
               ) : (
                  <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                     {order.trackingEvents.map((event, idx) => (
                        <div key={event.id} className="relative">
                           <div className={cn(
                             "absolute -left-8 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10",
                             idx === 0 ? "border-secondary scale-110 shadow-lg shadow-secondary/20" : "border-slate-200"
                           )}>
                              <div className={cn("w-2 h-2 rounded-full", idx === 0 ? "bg-secondary animate-pulse" : "bg-slate-300")} />
                           </div>
                           
                           <div className="space-y-2">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                 <h4 className="text-base font-black text-primary uppercase tracking-tight italic">
                                    {event.status.replace(/_/g, ' ')}
                                 </h4>
                                 <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap bg-muted px-3 py-1 rounded-full uppercase italic">
                                    {format(new Date(event.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                 </span>
                              </div>
                              
                              {event.location && (
                                 <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest italic">
                                    <MapPin size={12} /> {event.location}
                                 </div>
                              )}
                              
                              {event.note && (
                                 <p className="text-sm font-bold text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl italic">
                                    &ldquo;{event.note}&rdquo;
                                 </p>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          {/* Order Info */}
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 pb-2 italic">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Info size={16} className="text-secondary" /> Détails Commande
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-4 italic">
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                     <span className="text-muted-foreground">Date</span>
                     <span className="text-primary font-black">{format(new Date(order.createdAt), "dd/MM/yyyy", { locale: fr })}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                     <span className="text-muted-foreground">Source</span>
                     <span className="text-primary font-black">{order.sourceType}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                     <span className="text-muted-foreground">Paiement</span>
                     <Badge variant="outline" className={cn(
                       "rounded-full font-black uppercase text-[9px] tracking-widest py-0.5 px-3 border-none",
                       order.paymentStatus === 'PAID' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                     )}>
                        {order.paymentStatus}
                     </Badge>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 pb-2 italic">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Truck size={16} className="text-secondary" /> Livraison
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-4 italic">
               <div className="bg-slate-50 p-6 rounded-3xl space-y-3">
                  <div className="flex items-start gap-3">
                     <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                     <div className="text-sm font-bold text-primary leading-tight">
                        {order.shippingAddress || 'Aucune adresse enregistrée.'}
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

           {/* Hub Sharufa Info */}
           {order.cargo && (
              <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-[#002B24] text-white">
                <CardHeader className="p-8 pb-2 italic">
                   <CardTitle className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                      <Warehouse size={16} /> Hub Logistique
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-4 italic">
                   <div className="space-y-1">
                      <div className="text-lg font-black uppercase tracking-tight italic">{order.cargo.name}</div>
                      <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Route {order.originCountry} → {order.destinationCountry}</div>
                   </div>
                   <div className="text-xs font-medium text-white/80 leading-relaxed border-t border-white/10 pt-4">
                      {order.cargo.warehouseAddress}
                   </div>
                </CardContent>
              </Card>
           )}
           
           {/* Consolidation Batch Info (Phase 6) */}
           {order.shipmentBatch && (
              <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-sky-50">
                <CardHeader className="p-8 pb-2 italic">
                   <CardTitle className="text-[10px] font-black uppercase tracking-widest text-sky-800 flex items-center gap-2">
                      <Package size={16} className="text-sky-600" /> Groupage d'expédition
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-4 italic">
                   <div className="space-y-1">
                      <div className="text-lg font-black uppercase tracking-tight text-sky-900 italic">Lot {order.shipmentBatch.batchNumber}</div>
                      <div className="flex gap-2 text-[10px] font-bold text-sky-700/70 uppercase tracking-widest">
                         {order.shipmentBatch.transportMode === 'AIR' ? 'Fret Aérien' : 'Fret Maritime'}
                         {order.shipmentBatch.containerType && ` • Conteneur ${order.shipmentBatch.containerType.replace('FT', '')} Pieds`}
                      </div>
                   </div>
                   <div className="text-xs font-bold text-sky-800/80 leading-relaxed border-t border-sky-100 pt-4">
                      Votre commande est consolidée avec d'autres envois. Son statut global est : <span className="uppercase text-sky-600 font-black">{order.shipmentBatch.status}</span>.
                   </div>
                </CardContent>
              </Card>
           )}

          {/* Need help? */}
          <div className="p-8 bg-white/40 border-2 border-dashed border-slate-200 rounded-[40px] text-center italic">
             <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Besoin d&apos;assistance ?</div>
             <Button variant="outline" className="w-full rounded-2xl font-bold italic" asChild>
                <Link href="/about">Contacter le support</Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
