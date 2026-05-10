'use client'

import React from 'react'
import { 
  DollarSign, 
  Store, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Wallet, 
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Info
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updatePayoutStatus } from '@/lib/actions/admin/finance/actions'
import { AuditLogList } from '@/components/admin/compliance/AuditLogList'
import { cn } from '@/lib/utils'

interface VendorFinanceDetailProps {
  shop: any
  transactions: any[]
  events: any[]
}

export function VendorFinanceDetail({ shop, transactions, events }: VendorFinanceDetailProps) {
  const [isUpdating, setIsUpdating] = React.useState(false)

  const stats = {
    totalSales: transactions.reduce((acc, t) => acc + t.totalAmount, 0),
    totalCommission: transactions.reduce((acc, t) => acc + t.commissionAmount, 0),
    netEligible: transactions.filter(t => t.status === 'ELIGIBLE').reduce((acc, t) => acc + t.netAmount, 0),
    totalPaid: transactions.filter(t => t.status === 'PAID').reduce((acc, t) => acc + t.netAmount, 0),
    totalPending: transactions.filter(t => t.status === 'PENDING').reduce((acc, t) => acc + t.netAmount, 0)
  }

  const handleUpdateStatus = async (transactionId: string, status: string) => {
    setIsUpdating(true)
    const res = await updatePayoutStatus(transactionId, status as any)
    if (res.success) {
      toast.success(`Statut financier mis à jour ✅`)
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsUpdating(false)
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Vendor Header */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
           <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-slate-100 flex items-center justify-center text-primary font-black text-3xl">
              {shop.name[0]}
           </div>
           <div>
              <div className="flex items-center gap-4 mb-2 italic">
                 <h1 className="text-3xl font-black text-primary uppercase tracking-tighter italic">{shop.name}</h1>
                 {shop.isVerified && <Badge className="bg-secondary text-primary border-none rounded-full px-4 italic"><ShieldCheck size={12} className="mr-1" /> Vérifiée</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                 <div className="flex items-center gap-2"><MapPin size={16} className="text-secondary" /> {shop.country || 'International'}</div>
                 <div className="flex items-center gap-2"><Landmark size={16} className="text-secondary" /> RIB: {shop.documents.length > 0 ? 'VALIDÉ' : 'MANQUANT'}</div>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-8 text-center bg-slate-50 px-10 py-6 rounded-[32px] border border-slate-100">
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic mb-1">Gains Totaux</div>
              <div className="text-2xl font-black text-primary italic">$ {(stats.totalPaid + stats.netEligible + stats.totalPending).toLocaleString()}</div>
           </div>
           <div className="w-px h-10 bg-slate-200" />
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-secondary italic mb-1 italic">Net à Payer</div>
              <div className="text-2xl font-black text-green-600 italic">$ {stats.netEligible.toLocaleString()}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-[40px] border-none shadow-sm bg-white p-8 space-y-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-muted-foreground/40">
                    <ArrowUpRight size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Cumul Ventes</p>
                    <p className="text-xl font-black text-primary italic">$ {stats.totalSales.toLocaleString()}</p>
                 </div>
              </Card>
              <Card className="rounded-[40px] border-none shadow-sm bg-white p-8 space-y-4 ring-2 ring-secondary/5">
                 <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-400">
                    <ArrowDownLeft size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic tracking-tighter">Comm. Sharufa (14%)</p>
                    <p className="text-xl font-black text-red-500 italic">- $ {stats.totalCommission.toLocaleString()}</p>
                 </div>
              </Card>
              <Card className="rounded-[40px] border-none shadow-sm bg-primary p-8 space-y-4 text-white overflow-hidden relative group">
                 <Wallet size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform" />
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-secondary">
                    <CheckCircle2 size={24} />
                 </div>
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Total Déjà Payé</p>
                    <p className="text-xl font-black italic">$ {stats.totalPaid.toLocaleString()}</p>
                 </div>
              </Card>
           </div>

           {/* Transactions History */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 italic">
                 <div className="flex items-center gap-3">
                    <History className="text-secondary" size={20} />
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary italic tracking-tighter">Grand Livre des Transactions</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-slate-50">
                             <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Date / Commande</th>
                             <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Montant Brut</th>
                             <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Gains Net (86%)</th>
                             <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic text-center">Actions / Statut</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {transactions.map((t) => (
                             <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-6 italic">
                                   <div className="text-xs font-black text-primary uppercase">#{t.order?.orderNumber || 'N/A'}</div>
                                   <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1 tracking-tighter">{format(new Date(t.createdAt), "dd MMM yyyy", { locale: fr })}</div>
                                </td>
                                <td className="px-10 py-6 text-xs font-black text-primary/60 italic">
                                   $ {t.totalAmount.toLocaleString()}
                                </td>
                                <td className="px-10 py-6 text-sm font-black text-primary italic">
                                   $ {t.netAmount.toLocaleString()}
                                </td>
                                <td className="px-10 py-6 text-center italic">
                                   <div className="flex items-center justify-center gap-4">
                                      {t.status === 'ELIGIBLE' && (
                                        <Button 
                                          size="sm"
                                          disabled={isUpdating}
                                          onClick={() => handleUpdateStatus(t.id, 'PAID')}
                                          className="bg-secondary hover:bg-secondary/90 text-primary rounded-full px-6 text-[9px] font-black uppercase tracking-widest shadow-xl shadow-secondary/10"
                                        >
                                          Marquer Payé
                                        </Button>
                                      )}
                                      {t.status === 'PENDING' && (
                                        <Badge variant="outline" className="border-slate-200 text-slate-400 rounded-full text-[9px] font-black uppercase px-3 italic">En attente</Badge>
                                      )}
                                      {t.status === 'PAID' && (
                                        <div className="text-green-600 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest italic">
                                           <CheckCircle2 size={12} /> Payé
                                        </div>
                                      )}
                                      {t.status === 'ON_HOLD' && (
                                        <div className="text-red-500 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest italic">
                                           <AlertTriangle size={12} /> Bloqué
                                        </div>
                                      )}
                                   </div>
                                </td>
                             </tr>
                          ))}
                          {transactions.length === 0 && (
                             <tr>
                                <td colSpan={4} className="py-20 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest italic">Aucun flux financier détecté pour ce vendeur.</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-10">
           {/* Compliance / Bank Status */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="p-10 pb-4 italic">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 italic">
                    <ShieldCheck size={16} className="text-secondary" /> Conformité Décaissement
                 </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6 italic">
                 <div className={cn(
                    "p-6 rounded-3xl flex items-center gap-4 border",
                    shop.isVerified ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-500"
                 )}>
                    {shop.isVerified ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    <div>
                       <div className="text-xs font-black uppercase">Badge Verified</div>
                       <div className="text-[10px] font-bold mt-1 tracking-tighter">{shop.isVerified ? "Boutique certifiée Sharufa" : "Accréditation manquante"}</div>
                    </div>
                 </div>

                 <div className={cn(
                    "p-6 rounded-3xl flex items-center gap-4 border",
                    shop.documents.length > 0 ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-500"
                 )}>
                    {shop.documents.length > 0 ? <Landmark size={24} /> : <AlertTriangle size={24} />}
                    <div>
                       <div className="text-xs font-black uppercase">Information RIB</div>
                       <div className="text-[10px] font-bold mt-1 tracking-tighter">{shop.documents.length > 0 ? "Coordonnées bancaires validées" : "Absence de compte bancaire valide"}</div>
                    </div>
                 </div>

                 {!shop.isVerified || shop.documents.length === 0 ? (
                   <div className="bg-amber-50 text-amber-700 p-6 rounded-3xl border border-amber-100 italic space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase">
                         <Info size={14} /> Attention
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed italic">
                         Les paiements sont automatiquement bloqués tant que la boutique n'est pas certifiée ou que le RIB n'est pas fourni.
                      </p>
                   </div>
                 ) : (
                   <div className="bg-primary text-white p-8 rounded-3xl shadow-xl shadow-primary/10 italic">
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 italic">Prêt pour virement</div>
                      <div className="text-xl font-black italic">$ {stats.netEligible.toLocaleString()}</div>
                      <div className="mt-4 pt-4 border-t border-white/10 italic text-[10px] font-black uppercase tracking-widest text-secondary cursor-pointer hover:underline flex items-center gap-2">
                         Générer Ordre Virement <ArrowRight size={14} />
                      </div>
                   </div>
                 )}
              </CardContent>
           </Card>

           {/* Financial History / Audit */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-slate-50/50">
              <CardHeader className="p-10 pb-4 italic">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 italic">
                    <History size={16} className="text-secondary" /> Audit Financier Vendeur
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-10 italic">
                 <AuditLogList events={events} />
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
