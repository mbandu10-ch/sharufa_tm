'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye,
  Pencil,
  Image as ImageIcon,
  CheckSquare
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { DeleteProductButton } from '@/components/seller/DeleteProductButton'
import { cn } from '@/lib/utils'

import { BulkCategoryUpdateModal } from './BulkCategoryUpdateModal'
import { Category, ShopType } from '@prisma/client'

interface ProductType {
  id: string
  name: string
  slug: string
  reference: string | null
  price: number
  stock: number
  status: string
  images: string[]
  categoryId: string
  category: { name: string } | null
}

interface SellerProductsClientProps {
  products: ProductType[]
  categories: (Category & { parent?: (Category & { parent?: Category | null }) | null })[]
  shopType: ShopType
  allowedCategoryIds?: string[]
}

export function SellerProductsClient({ products, categories, shopType, allowedCategoryIds }: SellerProductsClientProps) {
  const [search, setSearch] = useState('')
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.reference && p.reference.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedProductIds([])
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id))
    }
  }

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    )
  }

  const handleSuccess = () => {
    setSelectedProductIds([])
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black font-outfit text-primary tracking-tighter">Mon Inventaire</h1>
            <p className="text-muted-foreground font-medium">Gérez vos produits et vos stocks en temps réel.</p>
         </div>

         <Button asChild className="rounded-full bg-primary text-white h-14 px-8 font-black shadow-2xl shadow-primary/20 group">
            <Link href="/dashboard/seller/products/new">
               <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" /> Ajouter un Produit
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-secondary/20 transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold text-slate-600 border-slate-100 flex-1 md:flex-none">
               <Filter className="mr-2" size={18} /> Filtres
            </Button>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground px-4 py-2 border border-slate-100 rounded-2xl whitespace-nowrap">
               {filteredProducts.length} Produits
            </div>
         </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedProductIds.length > 0 && (
        <div className="bg-secondary/10 border-2 border-secondary/20 p-4 rounded-[24px] flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="text-secondary" size={24} />
            <span className="font-black text-primary">{selectedProductIds.length} produit(s) sélectionné(s)</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl border-secondary/20 bg-white hover:bg-secondary/10 font-bold"
              onClick={() => setIsBulkModalOpen(true)}
            >
              Changer la catégorie
            </Button>
            <Button variant="ghost" className="rounded-xl" onClick={() => setSelectedProductIds([])}>
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
         {/* Desktop Table View */}
         <Card className="hidden lg:block border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-8 py-4 w-10">
                          <input 
                            type="checkbox"
                            checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0} 
                            onChange={handleSelectAll} 
                            className="w-5 h-5 rounded border border-slate-300 cursor-pointer accent-primary appearance-auto"
                            style={{ appearance: 'auto' }}
                          />
                        </th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Produit</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégorie</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prix</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {paginatedProducts.length === 0 ? (
                        <tr>
                           <td colSpan={7} className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center space-y-4">
                                 <Package size={48} className="text-slate-200" />
                                 <p className="text-muted-foreground font-medium">Aucun produit trouvé.</p>
                                 <Button asChild variant="link" className="text-secondary font-black">
                                    <Link href="/dashboard/seller/products/new">Créer un article</Link>
                                 </Button>
                              </div>
                           </td>
                        </tr>
                     ) : (
                        paginatedProducts.map((product) => (
                           <tr key={product.id} className={cn("hover:bg-slate-50/30 transition-colors group", selectedProductIds.includes(product.id) && "bg-secondary/5 hover:bg-secondary/10")}>
                              <td className="px-8 py-4">
                                <input 
                                  type="checkbox"
                                  checked={selectedProductIds.includes(product.id)} 
                                  onChange={() => toggleProductSelection(product.id)}
                                  className="w-5 h-5 rounded border border-slate-300 cursor-pointer accent-primary appearance-auto"
                                  style={{ appearance: 'auto' }}
                                />
                              </td>
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
                                 <span className="text-sm font-black text-primary">$ {product.price.toLocaleString()}</span>
                              </td>
                              <td className="px-8 py-4">
                                 <div className="flex flex-col gap-1">
                                    <span className={cn(
                                       "text-sm font-bold",
                                       product.stock < 10 ? "text-red-500" : "text-primary"
                                    )}>
                                       {product.stock} unités
                                    </span>
                                 </div>
                              </td>
                              <td className="px-8 py-4">
                                 <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                                    product.status === 'APPROVED' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                 )}>
                                    {product.status === 'APPROVED' ? 'En Ligne' : 'En Attente'}
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
                                      href={`/dashboard/seller/products/edit/${product.id}`}
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

         {/* Mobile Card View */}
         <div className="lg:hidden space-y-4">
            {paginatedProducts.length === 0 ? (
               <div className="bg-white rounded-[32px] p-12 text-center border border-slate-100 shadow-sm">
                  <Package size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-muted-foreground font-medium">Aucun produit.</p>
               </div>
            ) : (
               paginatedProducts.map((product) => (
                  <div 
                     key={product.id} 
                     className={cn("bg-white p-6 rounded-[32px] border shadow-sm space-y-4 transition-colors", selectedProductIds.includes(product.id) ? "border-secondary/50 bg-secondary/5" : "border-slate-100")}
                  >
                     <div className="flex items-start justify-between gap-2 mb-2">
                        <input 
                           type="checkbox"
                           checked={selectedProductIds.includes(product.id)} 
                           onChange={() => toggleProductSelection(product.id)}
                           className="w-5 h-5 rounded border border-slate-300 cursor-pointer accent-primary appearance-auto"
                           style={{ appearance: 'auto' }}
                        />
                        <div className={cn(
                           "inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tight",
                           product.status === 'APPROVED' ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                        )}>
                           {product.status === 'APPROVED' ? 'En Ligne' : 'En Attente'}
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden relative shrink-0 border border-slate-100">
                           {product.images[0] ? (
                              <Image 
                                 src={product.images[0]} 
                                 alt={product.name} 
                                 fill 
                                 className="object-cover"
                              />
                           ) : (
                              <ImageIcon className="text-slate-300 absolute inset-0 m-auto" size={24} />
                           )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                           <h3 className="text-sm font-black text-primary truncate">{product.name}</h3>
                           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{product.category?.name}</p>
                           <div className="text-[10px] text-muted-foreground font-mono bg-slate-50 px-1.5 py-0.5 rounded w-fit uppercase">
                              Ref: {product.reference || product.id.slice(-6)}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Prix</span>
                           <p className="text-sm font-black text-primary">$ {product.price.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stock</span>
                           <p className={cn(
                              "text-sm font-black",
                              product.stock < 10 ? "text-red-500" : "text-primary"
                           )}>
                              {product.stock} unités
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between gap-3 pt-2">
                        <div className="flex gap-2">
                           <Link 
                              href={`/product/${product.slug}`} 
                              target="_blank"
                              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-xs font-bold transition-colors flex items-center gap-2"
                           >
                              <Eye size={14} /> Voir
                           </Link>
                           <Link 
                              href={`/dashboard/seller/products/edit/${product.id}`}
                              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-xs font-bold transition-colors flex items-center gap-2"
                           >
                              <Pencil size={14} /> Modifier
                           </Link>
                        </div>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Pagination Controls */}
         {totalPages > 1 && (
           <div className="flex items-center justify-center gap-4 pt-6">
             <Button
               variant="outline"
               className="rounded-xl border-2 font-bold"
               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
               disabled={currentPage === 1}
             >
               Précédent
             </Button>
             <span className="text-sm font-black text-muted-foreground">
               Page {currentPage} sur {totalPages}
             </span>
             <Button
               variant="outline"
               className="rounded-xl border-2 font-bold"
               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
               disabled={currentPage === totalPages}
             >
               Suivant
             </Button>
           </div>
         )}
      </div>

      <BulkCategoryUpdateModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        selectedProductIds={selectedProductIds}
        categories={categories}
        shopType={shopType}
        allowedCategoryIds={allowedCategoryIds}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
