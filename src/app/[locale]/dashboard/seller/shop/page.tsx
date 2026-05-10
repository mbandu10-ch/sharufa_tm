import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { 
  Store, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Type,
  Globe,
  Layout
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default async function MyShopPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  const shop = profile?.shop
  if (!shop && profile?.role !== 'ADMIN') {
    redirect('/dashboard/buyer')
  }

  // Fallback for admin
  const finalShop = shop || await prisma.shop.findUnique({ where: { slug: 'sharufa-store' } })
  if (!finalShop) redirect('/dashboard/buyer')

  const statusLabel: Record<string, { label: string, color: string }> = {
    APPROVED: { label: 'Active & Publique', color: 'bg-green-100 text-green-700 border-green-200' },
    PENDING: { label: 'En attente de validation', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    UNDER_REVIEW: { label: 'En cours d\'examen', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    REJECTED: { label: 'Refusée', color: 'bg-red-100 text-red-700 border-red-200' },
    SUSPENDED: { label: 'Suspendue', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  }

  const currentStatus = statusLabel[finalShop.status] || { label: finalShop.status, color: 'bg-slate-100 text-slate-700' }

  return (
    <div className="space-y-10 max-w-7xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border", currentStatus.color)}>
                {currentStatus.label}
             </span>
          </div>
          <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter">Ma Boutique</h1>
          <p className="text-muted-foreground font-medium">Gérez votre vitrine commerciale et votre identité de marque.</p>
        </div>

        <Button asChild className="rounded-full bg-secondary text-primary hover:bg-secondary/90 h-14 px-8 font-black shadow-xl shadow-secondary/10">
           <Link href={`/shop/${finalShop.slug}`} target="_blank">
              Voir la boutique publique <ExternalLink className="ml-2" size={18} />
           </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Main Identity Section */}
          <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                   <Type size={24} />
                </div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic">Identité de Marque</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nom de la Boutique</label>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-primary">
                      {finalShop.name}
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Lien (Slug)</label>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs text-secondary">
                      sharufa.com/shop/{finalShop.slug}
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Description Commerciale</label>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 font-medium text-slate-600 leading-relaxed min-h-[120px]">
                   {finalShop.description || "Aucune description renseignée."}
                </div>
             </div>

             <Button variant="outline" className="rounded-2xl h-14 px-8 font-bold border-2" disabled>
                Modifier les informations
             </Button>
          </section>

          {/* Visual Assets Section */}
          <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                   <Layout size={24} />
                </div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic">Visuels & Branding</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 text-center block">Logo Officiel</label>
                   <div className="aspect-square rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group relative">
                      {finalShop.logo ? (
                         <Image src={finalShop.logo} alt="Logo" fill sizes="(max-width: 768px) 100vw, 200px" className="object-contain p-8" />
                      ) : (
                         <div className="text-center space-y-2">
                            <ImageIcon className="mx-auto text-slate-300" size={40} />
                            <p className="text-[10px] font-bold text-slate-400">Format Carré Recommandé</p>
                         </div>
                      )}
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
                         <span className="text-white font-black text-xs uppercase tracking-widest">Changer le Logo</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 text-center block">Bannière de Profil</label>
                   <div className="aspect-square rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group relative">
                      {finalShop.banner ? (
                         <Image src={finalShop.banner} alt="Banner" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                      ) : (
                         <div className="text-center space-y-2">
                            <ImageIcon className="mx-auto text-slate-300" size={40} />
                            <p className="text-[10px] font-bold text-slate-400">Format Paysage Recommandé</p>
                         </div>
                      )}
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
                         <span className="text-white font-black text-xs uppercase tracking-widest">Changer la Bannière</span>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar: Preview & Status */}
        <div className="space-y-10">
           {/* Live Preview Card */}
           <div className="bg-primary rounded-[40px] overflow-hidden shadow-2xl relative group">
              <div className="absolute top-0 right-0 p-6">
                 <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    <Globe size={20} />
                 </div>
              </div>
              
              <div className="p-10 space-y-8">
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Aperçu Boutique</span>
                    <h4 className="text-2xl font-black text-white italic">Vision Client</h4>
                 </div>

                 <div className="bg-white rounded-[32px] p-6 space-y-4 shadow-xl">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden relative">
                          {finalShop.logo && <Image src={finalShop.logo} alt="L" fill sizes="56px" className="object-contain p-2" />}
                       </div>
                       <div>
                          <div className="text-sm font-black text-primary">{finalShop.name}</div>
                          <div className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase tracking-widest">
                             <CheckCircle2 size={10} /> Boutique Vérifiée
                          </div>
                       </div>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">Articles en ligne</span>
                       <span className="text-sm font-black text-primary">--</span>
                    </div>
                    <Button variant="secondary" className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-12" disabled>
                       Visiter la Boutique
                    </Button>
                 </div>

                 <p className="text-[11px] text-white/40 font-medium leading-relaxed italic text-center px-4">
                    Ceci est une représentation simplifiée de votre carte boutique dans le marketplace Sharufa.
                 </p>
              </div>
           </div>

           {/* Visibility Settings */}
           <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                 <Globe size={16} className="text-secondary" /> Visibilité Publique
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div className="space-y-0.5">
                    <p className="text-sm font-black text-primary uppercase tracking-tight">Status Marketplace</p>
                    <p className="text-xs font-bold text-muted-foreground">Boutique en ligne</p>
                 </div>
                 <div className={cn(
                   "w-12 h-6 rounded-full relative transition-colors",
                   finalShop.isVisible ? "bg-green-500" : "bg-slate-300"
                 )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                      finalShop.isVisible ? "right-1" : "left-1"
                    )} />
                 </div>
              </div>

              {!finalShop.isVisible && (
                <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                   <AlertCircle size={18} className="text-amber-600 shrink-0" />
                   <p className="text-[10px] font-bold text-amber-900 leading-tight">
                      Votre boutique est masquée pour le moment car elle est en attente de validation finale par l&apos;équipe Sharufa.
                   </p>
                </div>
              )}
           </section>
        </div>
      </div>
    </div>
  )
}
