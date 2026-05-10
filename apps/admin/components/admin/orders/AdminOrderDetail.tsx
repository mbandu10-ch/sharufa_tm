'use client'

import React from 'react'
import { 
  ShoppingBag, 
  Store, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  Truck, 
  CreditCard,
  Info,
  Calendar,
  Layers,
  Search,
  ChevronRight,
  ArrowRight,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  History
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderActionsSidebar } from './OrderActionsSidebar'
import { AuditLogList } from '@/components/admin/compliance/AuditLogList'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AdminOrderDetailProps {
  order: any
  events: any[]
  statusHistory?: any[]
}

export function AdminOrderDetail({ order, events, statusHistory = [] }: AdminOrderDetailProps) {
  const subtotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
      <div className="lg:col-span-2 space-y-10">
         {/* Order Status Banner */}
         <div className="bg-white rounded-[40px] p-10 border border-primary/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/10">
                  <ShoppingBag size={32} />
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 italic">Détails Commande</div>
                  <h1 className="text-3xl font-black text-primary uppercase tracking-tighter leading-none italic">{order.orderNumber}</h1>
               </div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
               <div className="text-right hidden md:block">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic mb-1">Date d'achat</div>
                  <div className="text-sm font-black text-primary">{format(new Date(order.createdAt), "dd MMMM yyyy", { locale: fr })}</div>
               </div>
               <Badge className={cn(
                  "px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest border-none shadow-lg",
                  order.status === 'DELIVERED' ? "bg-green-100 text-green-700 shadow-green-100/50" : "bg-orange-100 text-orange-700 shadow-orange-100/50"
               )}>
                  {order.status}
               </Badge>
            </div>
         </div>

         {/* Items List */}
         <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
               <div className="flex items-center gap-3">
                  <Package className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Contenu du Colis ({order.items.length})</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-50">
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Article</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Quantité</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {order.items.map((item: any) => (
                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors italic">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border border-slate-100 shadow-inner">
                                    <img src={item.product.images[0] || 'https://via.placeholder.com/150'} alt="p" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <div className="text-sm font-black text-primary uppercase line-clamp-1">{item.product.name}</div>
                                    <div className="flex flex-wrap gap-2 mt-1 italic">
                                       <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">PU: {item.price.toLocaleString()} {order.currency}</div>
                                       {item.selectedSize && (
                                          <div className="text-[10px] text-secondary font-black uppercase tracking-widest bg-secondary/5 px-2 py-0.5 rounded-lg border border-secondary/10">
                                             Taille: {item.selectedSize}
                                          </div>
                                       )}
                                       {item.selectedColor && (
                                          <div className="text-[10px] text-secondary font-black uppercase tracking-widest bg-secondary/5 px-2 py-0.5 rounded-lg border border-secondary/10">
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

               {/* Totals Section */}
               <div className="bg-[#002B24] p-10 mt-0 text-white flex flex-col items-end gap-3 rounded-b-[40px] relative overflow-hidden">
                  <ReceiptText size={180} className="absolute -left-12 -bottom-12 text-white/5 opacity-40 scale-125" />
                  <div className="flex justify-between w-full max-w-xs text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                     <span>Sous-total HT</span>
                     <span className="text-white/80">{subtotal.toLocaleString()} {order.currency}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                     <span>Frais de livraison</span>
                     <span className="text-white/80">0 {order.currency}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs mt-4 pt-4 border-t border-white/10 relative z-10">
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary italic">Montant Total TTC</span>
                     <span className="text-2xl font-black italic">{order.totalAmount.toLocaleString()} {order.currency}</span>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Logistics History with Proofs */}
         <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white italic">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
               <div className="flex items-center gap-3">
                  <Truck className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Suivi Logistique & Preuves</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-10">
                {statusHistory.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground italic">
                     Aucune preuve logistique enregistrée.
                  </div>
                ) : (
                  <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                     {statusHistory.map((history, idx) => (
                        <div key={history.id} className="relative">
                           <div className={cn(
                             "absolute -left-8 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10",
                             idx === 0 ? "border-secondary" : "border-slate-200"
                           )}>
                              <div className={cn("w-2 h-2 rounded-full", idx === 0 ? "bg-secondary" : "bg-slate-300")} />
                           </div>
                           
                           <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-sm font-black text-primary uppercase italic">
                                    {history.new.replace(/_/g, ' ')}
                                 </h4>
                                 <span className="text-[9px] font-bold text-muted-foreground uppercase px-3 py-1 bg-slate-50 rounded-full">
                                    {format(new Date(history.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                 </span>
                              </div>
                              
                              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                 Par: {history.changedBy?.firstName || 'Système'} ({history.changedByRole})
                              </div>
                              
                              {history.note && (
                                 <p className="text-xs font-bold text-slate-600 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {history.note}
                                 </p>
                              )}

                              {history.mediaUrls && history.mediaUrls.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                   {history.mediaUrls.map((url: string, i: number) => (
                                     <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:ring-2 hover:ring-secondary transition-all">
                                        <img src={url} alt="Proof" className="w-full h-full object-cover" />
                                     </a>
                                   ))}
                                </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
                )}
            </CardContent>
         </Card>

         {/* Timeline / Audit Log (General Events) */}
         <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
               <div className="flex items-center gap-3">
                  <History className="text-secondary" size={20} />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Timeline Transactionnelle</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-10 italic">
               <AuditLogList events={events} />
            </CardContent>
         </Card>
      </div>

      <div className="space-y-10">
         {/* OrderActions (Sidebar) */}
         <OrderActionsSidebar order={order} />

         {/* Customer Info Card */}
         <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-10 pb-4 italic">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <User size={16} className="text-secondary" /> Client Marketplace
               </CardTitle>
            </CardHeader>
            <CardContent className="px-10 pb-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary font-black text-lg">
                     {order.client.firstName[0]}{order.client.lastName[0]}
                  </div>
                  <div className="italic">
                     <div className="text-sm font-black text-primary uppercase">{order.client.firstName} {order.client.lastName}</div>
                     <div className="text-[10px] text-muted-foreground font-bold uppercase italic">Membre depuis {format(new Date(order.client.createdAt), "MMM yyyy", { locale: fr })}</div>
                  </div>
               </div>
               
               <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-sm font-bold text-primary italic">
                     <Mail size={16} className="text-muted-foreground opacity-50" />
                     {order.client.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-primary italic">
                     <Phone size={16} className="text-muted-foreground opacity-50" />
                     {order.client.phone || 'N/A'}
                  </div>
                  <div className="flex items-start gap-3 text-sm font-bold text-primary italic">
                     <MapPin size={16} className="text-muted-foreground opacity-50 mt-1" />
                     <div className="leading-tight">{order.shippingAddress || 'No shipping address provided.'}</div>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Shop Info Card */}
         <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-slate-50/50">
            <CardHeader className="p-10 pb-4 italic">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Store size={16} className="text-secondary" /> Boutique Partenaire
               </CardTitle>
            </CardHeader>
            <CardContent className="px-10 pb-10 space-y-4 italic">
               <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm italic transition-all hover:shadow-md">
                  <div>
                     <div className="text-sm font-black text-primary uppercase mb-1">{order.shop?.name || 'Vente Directe Sharufa'}</div>
                     <div className="text-[10px] font-bold text-muted-foreground uppercase italic tracking-widest">{order.shop?.country || 'N/A'}</div>
                  </div>
                  <Link href={`/admin/shops/${order.shopId}`} className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                     <ChevronRight size={18} />
                  </Link>
               </div>
            </CardContent>
         </Card>

         {/* Financial Summary */}
         <div className="bg-white rounded-[40px] p-10 border border-primary/5 shadow-sm space-y-4 relative overflow-hidden">
            <TrendingUp size={100} className="absolute -right-8 -bottom-8 text-primary/5 opacity-40" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic relative z-10">
               <CreditCard size={16} className="text-secondary" /> Résumé Financier
            </h4>
            <div className="space-y-4 relative z-10 italic">
               <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase border-b border-slate-50 pb-2">
                  <span>Source de vente</span>
                  <span className="text-primary font-black italic">{order.sourceType}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase border-b border-slate-50 pb-2">
                  <span>Comm. Sharufa (%)</span>
                  <span className="text-secondary font-black italic">14%</span>
               </div>
               <div className="flex justify-between items-center text-[11px] font-black text-primary uppercase pt-2">
                  <span>Net Boutique</span>
                  <span className="italic">{(order.totalAmount * 0.86).toLocaleString()} {order.currency}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
