import React from 'react'
import { prisma } from '@sharufa/db'
import { Card, CardContent, CardHeader, CardTitle } from '@sharufa/ui/components/card'
import { 
  Store, 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  CreditCard,
  Search,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Settings,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@sharufa/ui/components/badge'
import { Button } from '@sharufa/ui/components/button'
import { cn } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const shopCount = await prisma.shop.count()
  const verifiedCount = await prisma.shop.count({ where: { isVerified: true } })
  const productCount = await prisma.product.count()
  const pendingDocs = await prisma.shopDocument.count({ where: { verificationStatus: 'PENDING' } })

  const widgets = [
    { name: 'Boutiques Partenaires', value: shopCount, icon: Store, color: 'text-primary', bg: 'bg-primary/5', href: '/admin/shops' },
    { name: 'Conformité Validée', value: verifiedCount, icon: ShieldCheck, color: 'text-secondary', bg: 'bg-secondary/10', href: '/admin/compliance' },
    { name: 'Catalogue Global', value: productCount, icon: Package, color: 'text-blue-600', bg: 'bg-blue-600/5', href: '/admin/products' },
    { name: 'Commandes Total', value: 0, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-600/5', href: '/admin/orders' },
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-secondary mb-2">
              <Activity size={20} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pilotage Marketplace</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tighter">Tableau de Bord Global</h1>
           <p className="text-muted-foreground font-medium mt-2 max-w-xl italic">
             Bonjour Admin, bienvenue sur votre centre de pilotage Sharufa. Surveillez l'état de la plateforme en temps réel.
           </p>
        </div>
        
        <div className="flex gap-4">
           <Link 
              href="/admin/compliance/alerts" 
              className="bg-red-50 text-red-600 px-6 py-4 rounded-3xl border border-red-100 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-red-100 transition-all"
           >
              <AlertTriangle size={16} />
              {pendingDocs} Dossiers en attente
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((w, i) => (
          <Link key={i} href={w.href}>
            <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-500 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{w.name}</CardTitle>
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-colors", w.bg, w.color, "group-hover:bg-primary group-hover:text-white")}>
                  <w.icon size={20} />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-4xl font-black text-primary mb-1">{w.value}</div>
                <div className="flex items-center gap-1.5 text-secondary text-xs font-black uppercase tracking-widest italic group-hover:translate-x-2 transition-transform">
                   Voir Détails <ArrowUpRight size={14} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 border border-primary/5 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <TrendingUp size={16} className="text-secondary" /> Volume d'activité récent
                  </h3>
                  <Badge className="bg-primary/5 text-primary border-none text-[10px] uppercase font-black tracking-widest">30 derniers jours</Badge>
               </div>
               <div className="h-64 flex items-center justify-center bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">Graphique de performance (Prochainement)</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#002B24] text-white rounded-[40px] p-10 group hover:scale-[1.02] transition-all">
                  <Search size={32} className="text-secondary mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">Module Sourcing</h3>
                  <p className="text-white/40 text-sm font-medium mb-6">Explorez de nouveaux fournisseurs et produits importables sur la marketplace.</p>
                  <Link href="/admin/sourcing" className="inline-flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-widest hover:underline">Accéder au Sourcing <ChevronRight size={14} /></Link>
               </div>

               <div className="bg-secondary text-primary rounded-[40px] p-10 group hover:scale-[1.02] transition-all shadow-xl shadow-secondary/10">
                  <CreditCard size={32} className="text-primary mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">Centre Finance</h3>
                  <p className="text-primary/40 text-sm font-medium mb-6">Suivez les revenus, les commissions et les virements vendeurs en temps réel.</p>
                  <Link href="/admin/finance" className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Voir les Finances <ChevronRight size={14} /></Link>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
               <CardHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                  <div className="flex items-center gap-3 text-primary">
                     <Users size={18} className="text-secondary" />
                     <CardTitle className="text-xs font-black uppercase tracking-widest leading-none">Administration</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed italic">Gérez les rôles et permissions des employés et partenaires de la plateforme Sharufa.</p>
                  <Button variant="outline" className="w-full rounded-2xl border-2 border-primary/5 text-[10px] font-black uppercase tracking-widest h-auto py-3">Gérer l'Équipe</Button>
               </CardContent>
            </Card>

            <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
               <CardHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                  <div className="flex items-center gap-3 text-primary">
                     <Settings size={18} className="text-secondary" />
                     <CardTitle className="text-xs font-black uppercase tracking-widest leading-none">Réglages Système</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed italic">Configurez les frais de service, les taxes et les paramètres techniques globaux.</p>
                  <Button variant="outline" className="w-full rounded-2xl border-2 border-primary/5 text-[10px] font-black uppercase tracking-widest h-auto py-3">Configuration</Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
