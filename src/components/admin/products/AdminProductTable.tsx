'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Package, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Store, 
  MapPin,
  Tag,
  Search,
  Filter
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AdminProductTableProps {
  products: any[]
}

export function AdminProductTable({ products }: AdminProductTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('ALL')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.shop?.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (statusFilter === 'ALL') return matchesSearch
    return matchesSearch && product.status === statusFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><CheckCircle2 size={12} className="mr-1.5" /> Approuvé</Badge>
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <Badge className="bg-orange-100 text-orange-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><Clock size={12} className="mr-1.5" /> En Révision</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><AlertTriangle size={12} className="mr-1.5" /> Rejeté</Badge>
      case 'NEEDS_CORRECTION':
        return <Badge className="bg-amber-100 text-amber-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><Tag size={12} className="mr-1.5" /> Correction</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">Brouillon</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Rapid Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_CORRECTION'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                statusFilter === f 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary border border-primary/5"
              )}
            >
              {f === 'ALL' ? 'Tous' : f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text"
            placeholder="Rechercher un produit / boutique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-primary/5 rounded-full pl-16 pr-8 py-4 text-sm font-bold text-primary focus:ring-2 focus:ring-secondary/50 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/[0.02] border-b border-primary/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Produit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Boutique / Pays</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégorie</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prix / Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Statut</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-primary/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden border border-primary/5 shadow-inner">
                        <img src={product.images[0] || 'https://via.placeholder.com/150'} alt="product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-black text-primary uppercase tracking-tight text-sm truncate max-w-[200px]">{product.name}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">#{product.reference || product.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                          <Store size={14} className="text-secondary" />
                          <div className="text-xs font-bold text-primary">{product.shop?.name || 'Inconnu'}</div>
                       </div>
                       <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-muted-foreground" />
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{product.originCountry?.name || 'N/A'}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="rounded-full border-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest italic">{product.category.name}</Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="text-sm font-black text-primary">{product.price.toLocaleString()} CFA</div>
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                          Stock: <span className={cn(product.stock < 10 ? "text-red-500" : "text-primary")}>{product.stock}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-2 bg-primary/5 hover:bg-primary hover:text-white text-primary px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      Examiner <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="py-24 text-center">
               <Package size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
               <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs px-12 italic">Aucun produit ne correspond à ces critères dans le catalogue Sharufa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
