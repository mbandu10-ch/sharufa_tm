import React from 'react'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@sharufa/db'
import { redirect } from 'next/navigation'
import { 
  Wallet, 
  TrendingUp, 
  ArrowDownCircle, 
  Clock, 
  CheckCircle2,
  Info,
  CreditCard,
  History,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import { Button } from '@sharufa/ui/components/button'
import Link from 'next/link'
import { cn } from '@sharufa/shared'

export default async function SellerFinancesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      shop: {
        include: {
          legalProfile: true,
          financialTransactions: {
            orderBy: { createdAt: 'desc' },
            take: 20
          }
        }
      }
    }
  })

  const shop = profile?.shop
  if (!shop && profile?.role !== 'ADMIN') {
    redirect('/dashboard/buyer')
  }

  // Fallback for admin
  const finalShop = shop || await prisma.shop.findUnique({ 
    where: { slug: 'sharufa-store' },
    include: { legalProfile: true, financialTransactions: true }
  })
  if (!finalShop) redirect('/dashboard/buyer')

  // Fetch orders involving this shop's products to calculate real sales metrics
  const sellerOrderItems = await prisma.orderItem.findMany({
    where: { 
        product: { 
            shopId: finalShop.id
        },
        order: { 
            status: { not: 'CANCELLED' },
            paymentStatus: { in: ['PAID', 'SUCCESS', 'PENDING'] } // Include paid or pending payment
        }
    }
  })

  // Calculate stats
  // 1. Gross Sales: Sum of all item prices for this shop
  const totalGross = sellerOrderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  
  // 2. Commission: 10% of gross (theoretical for display)
  const totalCommission = totalGross * 0.10
  
  // 3. Transactions-based metrics (Accounting reality)
  const transactions = finalShop.financialTransactions || []
  
  const pendingAmount = transactions
    .filter(t => t.status === 'PENDING' || t.status === 'ELIGIBLE')
    .reduce((acc, t) => acc + t.netAmount, 0)
    
  const paidAmount = transactions
    .filter(t => t.status === 'PAID')
    .reduce((acc, t) => acc + t.netAmount, 0)

  const isPayoutConfigured = !!finalShop.legalProfile?.bankName || !!finalShop.legalProfile?.iban

  return (
    <div className="space-y-10 max-w-7xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter">Centre Financier</h1>
          <p className="text-muted-foreground font-medium">Gérez vos revenus, suivez vos versements et vos commissions.</p>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-full h-12 px-6 font-bold border-2" asChild>
              <Link href="/dashboard/seller/settings?tab=payout">
                 <CreditCard className="mr-2" size={18} /> Configurer Versements
              </Link>
           </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-primary text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
               <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Wallet size={24} className="text-secondary" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Solde Disponible</p>
                  <p className="text-3xl font-black italic tracking-tighter">$ {pendingAmount.toLocaleString()}</p>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <TrendingUp size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ventes Totales (Brut)</p>
               <p className="text-3xl font-black text-primary italic tracking-tighter">$ {totalGross.toLocaleString()}</p>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
               <ArrowDownCircle size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commissions Sharufa</p>
               <p className="text-3xl font-black text-primary italic tracking-tighter">$ {totalCommission.toLocaleString()}</p>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Déjà Versé</p>
               <p className="text-3xl font-black text-primary italic tracking-tighter">$ {paidAmount.toLocaleString()}</p>
            </div>
         </div>
      </div>

      {/* Payout Configuration Alert */}
      {!isPayoutConfigured && (
         <div className="bg-rose-50 border border-rose-100 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                  <AlertCircle size={24} />
               </div>
               <div className="space-y-1">
                  <h4 className="font-black text-rose-900 uppercase tracking-wide text-sm">Action Requise : Coordonnées de paiement manquantes</h4>
                  <p className="text-rose-800/70 text-sm font-medium leading-relaxed">
                     Vous n&apos;avez pas encore configuré vos informations de versement. Nous ne pourrons pas transférer vos fonds tant que votre RIB ou compte Mobile Money n&apos;est pas renseigné.
                  </p>
               </div>
            </div>
            <Button className="rounded-full bg-rose-600 hover:bg-rose-700 text-white h-12 px-8 font-black whitespace-nowrap" asChild>
                  <Link href="/dashboard/settings?tab=payout">Configurer maintenant</Link>
            </Button>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Transaction History */}
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <History size={24} />
                     </div>
                     <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic">Historique des Mouvements</h3>
                  </div>
                  <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                     Tout voir
                  </Button>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-slate-50">
                           <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID / Commande</th>
                           <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                           <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Montant Net</th>
                           <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Statut</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {transactions.length === 0 ? (
                           <tr>
                              <td colSpan={4} className="py-20 text-center text-muted-foreground font-medium italic">
                                 Aucune transaction enregistrée pour le moment.
                              </td>
                           </tr>
                        ) : (
                           transactions.map((t) => (
                              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="py-6">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-black text-primary uppercase">Order #{t.orderId?.slice(-6).toUpperCase()}</span>
                                       <span className="text-[10px] text-muted-foreground font-mono">{new Date(t.createdAt).toLocaleDateString()}</span>
                                    </div>
                                 </td>
                                 <td className="py-6">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vente Marketplace</span>
                                 </td>
                                 <td className="py-6 text-right">
                                    <span className="text-sm font-black text-primary">$ {t.netAmount.toLocaleString()}</span>
                                 </td>
                                 <td className="py-6 text-center">
                                    <div className={cn(
                                       "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight",
                                       t.status === 'PAID' ? "bg-green-50 text-green-600" : 
                                       t.status === 'PENDING' ? "bg-blue-50 text-blue-600" :
                                       "bg-slate-50 text-slate-600"
                                    )}>
                                       {t.status === 'PAID' ? 'Versé' : t.status === 'PENDING' ? 'En attente' : t.status}
                                    </div>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </section>
         </div>

         {/* Financial Policy & Help */}
         <div className="space-y-8">
            <section className="bg-primary p-10 rounded-[40px] shadow-sm text-white space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                     <HelpCircle size={24} className="text-secondary" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">Logique<br/>Financière</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Commission Sharufa</p>
                     <p className="text-sm font-medium text-white/70 leading-relaxed italic">
                        Le prix que vous renseignez est votre <span className="text-white font-black">prix vendeur</span>. 
                        Sharufa ajoute automatiquement les frais de transaction au prix final afin de protéger votre marge. 
                        Une commission de <span className="text-white font-black italic">10%</span> est prélevée sur chaque vente pour couvrir la plateforme et le marketing.
                     </p>
                  </div>
                  
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Cycle de Versement</p>
                     <p className="text-sm font-medium text-white/70 leading-relaxed italic">
                        Les fonds sont éligibles au versement <span className="text-white font-black italic">7 jours</span> après la livraison confirmée au client.
                     </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex gap-4">
                     <Info size={20} className="text-secondary shrink-0" />
                     <p className="text-[11px] font-medium text-white/60 italic leading-relaxed">
                        Les frais de logistique internationale ne sont pas déduits de vos revenus, car ils sont directement pris en charge par l’acheteur lors du checkout.
                     </p>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  )
}
