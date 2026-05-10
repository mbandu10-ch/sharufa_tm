import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye,
  Pencil,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { DeleteProductButton } from '@/components/seller/DeleteProductButton'

// Local fallback for cn to avoid persistent ReferenceError
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch shop
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  let shop = profile?.shop
  if (!shop && profile?.role === 'ADMIN') {
    shop = await prisma.shop.findUnique({ where: { slug: 'sharufa-store' } })
  }

  if (!shop) return <div>Boutique non trouvée</div>

  // Fetch products
  const products = await prisma.product.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
    include: { category: true, originCountry: true }
  })

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter">Mon Inventaire</h1>
            <p className="text-muted-foreground font-medium">Gérez vos produits et vos stocks en temps réel.</p>
         </div>

         <Button asChild className="rounded-full bg-primary text-white h-14 px-8 font-black shadow-2xl shadow-primary/20 group">
            <Link href="/dashboard/products/new">
               <Plus className="mr-2 h-5 w-5" /> Ajouter un Produit
            </Link>
         </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-[24px] shadow-sm">
         <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou référence..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-secondary/20 transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold text-slate-600 border-slate-100 flex-1 md:flex-none">
               <Filter className="mr-2" size={18} /> Filtres
            </Button>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground px-4 py-2 border border-slate-100 rounded-2xl whitespace-nowrap">
               {products.length} Produits
            </div>
         </div>
      </div>

      {/* Products Table */}
      <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Produit</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégorie</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prix</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {products.length === 0 ? (
                     <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
                           <div className="flex flex-col items-center space-y-4">
                              <Package size={48} className="text-slate-200" />
                              <p className="text-muted-foreground font-medium">Aucun produit dans votre inventaire.</p>
                              <Button asChild variant="link" className="text-secondary font-black">
                                 <Link href="/dashboard/products/new">Créer votre premier article</Link>
                              </Button>
                           </div>
                        </td>
                     </tr>
                  ) : (
                     products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                           <td className="px-8 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center relative flex-shrink-0">
                                    {product.images[0] ? (
                                       <Image 
                                          src={product.images[0]} 
                                          alt={product.name} 
                                          fill 
                                          className="object-cover"
                                       />
                                    ) : (
                                       <ImageIcon className="text-slate-300" size={24} />
                                    )}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-black text-primary truncate max-w-[200px]">{product.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono bg-slate-50 px-1.5 py-0.5 rounded w-fit mt-1 uppercase">
                                       Ref: {product.reference || product.id.slice(-6)}
                                    </span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-4">
                              <Badge variant="outline" className="rounded-full border-slate-100 bg-slate-50/50 text-slate-600 font-bold">
                                 {product.category?.name || "Non catégorisé"}
                              </Badge>
                           </td>
                           <td className="px-8 py-4">
                              <span className="text-sm font-black text-primary">${product.price.toFixed(2)}</span>
                           </td>
                           <td className="px-8 py-4">
                              <div className="flex flex-col gap-1">
                                 <span className={cn(
                                    "text-sm font-bold",
                                    product.stock < 10 ? "text-red-500" : "text-primary"
                                 )}>
                                    {product.stock} unités
                                 </span>
                                 {product.stock < 10 && (
                                    <span className="text-[9px] font-black uppercase text-red-400">Stock Faible</span>
                                 )}
                              </div>
                           </td>
                           <td className="px-8 py-4">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-green-50 text-green-600 border border-green-100">
                                 En Ligne
                              </div>
                           </td>
                           <td className="px-8 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Link 
                                   href={`/product/${product.slug}`} 
                                   target="_blank"
                                   className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-primary transition-colors"
                                 >
                                    <Eye size={18} />
                                 </Link>
                                 <Link 
                                   href={`/dashboard/products/edit/${product.id}`}
                                   className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-secondary transition-colors"
                                 >
                                    <Pencil size={18} />
                                 </Link>
                                 <DeleteProductButton productId={product.id} productName={product.name} />
                              </div>
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
