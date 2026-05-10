'use client'
import React from 'react'
import Link from 'next/link'
import { 
  ShieldCheck, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  MapPin,
  ExternalLink,
  Search,
  MoreVertical,
  Pause,
  Archive,
  Trash2,
  Play
} from 'lucide-react'
import { format, differenceInDays, isPast } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { updateShopStatus, deleteShopPermanently } from '@/app/seller/admin-actions'
import { toast } from 'sonner'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ShopListTableProps {
  shops: any[]
}

export function ShopListTable({ shops }: ShopListTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filter, setFilter] = React.useState('ALL')
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [shopToDelete, setShopToDelete] = React.useState<any | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  const handleStatusChange = async (shopId: string, status: any) => {
    const res = await updateShopStatus(shopId, status)
    if (res.success) {
      toast.success(`Statut mis à jour : ${status}`)
      window.location.reload()
    } else {
      toast.error(res.error)
    }
  }

  const handleDelete = async (shopId: string) => {
    setIsDeleting(shopId)
    const res = await deleteShopPermanently(shopId)
    if (res.success) {
      toast.success('Boutique supprimée définitivement.')
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsDeleting(null)
  }

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         shop.owner.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'ALL') return matchesSearch
    if (filter === 'PENDING') return matchesSearch && shop.verificationStatus === 'SUBMITTED'
    if (filter === 'VERIFIED') return matchesSearch && shop.isVerified
    if (filter === 'EXPIRED') {
      const expiryDate = shop.legalProfile?.tradeLicenseExpiryDate
      return matchesSearch && expiryDate && isPast(new Date(expiryDate))
    }
    if (filter === 'RENEWAL') {
      const expiryDate = shop.legalProfile?.tradeLicenseExpiryDate
      if (!expiryDate) return false
      const daysLeft = differenceInDays(new Date(expiryDate), new Date())
      return matchesSearch && daysLeft > 0 && daysLeft <= 30
    }
    return matchesSearch
  })

  const getStatusBadge = (shop: any) => {
    if (shop.status === 'ARCHIVED') {
      return <Badge className="bg-slate-200 text-slate-600 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><Archive size={12} className="mr-1.5" /> Archivé</Badge>
    }
    if (shop.status === 'SUSPENDED') {
      return <Badge className="bg-yellow-100 text-yellow-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><Pause size={12} className="mr-1.5" /> Suspendu</Badge>
    }
    if (shop.isVerified) {
      return <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><CheckCircle2 size={12} className="mr-1.5" /> Vérifié</Badge>
    }
    
    switch (shop.verificationStatus) {
      case 'SUBMITTED':
        return <Badge className="bg-orange-100 text-orange-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><Clock size={12} className="mr-1.5" /> En attente</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest"><AlertTriangle size={12} className="mr-1.5" /> Rejeté</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">Incomplet</Badge>
    }
  }

  const getExpiryLabel = (date: Date | null) => {
    if (!date) return <span className="text-muted-foreground text-xs font-bold uppercase italic opacity-40">N/A</span>
    
    const expiry = new Date(date)
    const daysLeft = differenceInDays(expiry, new Date())
    const formattedDate = format(expiry, 'dd MMM yyyy', { locale: fr })

    if (isPast(expiry)) {
      return <span className="text-red-600 font-bold text-xs flex items-center gap-1.5"><AlertTriangle size={14} /> Expiré ({formattedDate})</span>
    }

    if (daysLeft <= 30) {
      return <span className="text-orange-600 font-bold text-xs flex items-center gap-1.5"><Clock size={14} /> {daysLeft}j ({formattedDate})</span>
    }

    return <span className="text-primary font-bold text-xs tracking-tight">{formattedDate}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Rapid Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['ALL', 'PENDING', 'VERIFIED', 'RENEWAL', 'EXPIRED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                filter === f 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary border border-primary/5"
              )}
            >
              {f === 'ALL' && 'Toutes'}
              {f === 'PENDING' && 'En attente'}
              {f === 'VERIFIED' && 'Vérifiées'}
              {f === 'RENEWAL' && 'Renouvellement'}
              {f === 'EXPIRED' && 'Expirées'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text"
            placeholder="Rechercher une boutique / email..."
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
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Boutique</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Propriétaire</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pays</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Statut</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expiration</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right tracking-tight">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredShops.map((shop) => (
                <tr key={shop.id} className="group hover:bg-primary/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden border border-primary/5">
                        <img src={shop.logo || 'https://via.placeholder.com/150'} alt="logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className={cn(
                          "font-black tracking-tight text-sm flex items-center gap-2 uppercase",
                          shop.status === 'ARCHIVED' || shop.status === 'SUSPENDED' ? "text-muted-foreground opacity-50" : "text-primary"
                        )}>
                           {shop.name}
                           {shop.isVerified && <CheckCircle2 size={14} className="text-secondary" />}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">#{shop.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <User size={14} className={shop.status === 'ARCHIVED' ? "text-slate-300" : "text-secondary"} />
                       <div className="text-xs font-bold text-primary truncate max-w-[150px]">{shop.owner.email}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-muted-foreground" />
                       <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{shop.country || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {getStatusBadge(shop)}
                  </td>
                  <td className="px-8 py-6">
                    {getExpiryLabel(shop.legalProfile?.tradeLicenseExpiryDate)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/compliance/${shop.id}`}
                        className="inline-flex items-center gap-2 bg-primary/5 hover:bg-primary hover:text-white text-primary px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Dossier <ChevronRight size={14} />
                      </Link>
                      
                      <DropdownMenu>
                      <DropdownMenuTrigger
                        render={(props) => (
                          <Button {...props} variant="ghost" className="w-10 h-10 rounded-full p-0">
                            <MoreVertical size={16} />
                          </Button>
                        )}
                      />
                        <DropdownMenuContent align="end" className="w-56 rounded-[24px] p-2 border-primary/5 shadow-2xl">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gestion Boutique</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          
                          {shop.status === 'SUSPENDED' || shop.status === 'ARCHIVED' ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(shop.id, 'APPROVED')} className="rounded-xl px-4 py-3 cursor-pointer">
                              <Play size={16} className="mr-3 text-green-500" />
                              <span className="text-xs font-bold">Réactiver la boutique</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(shop.id, 'SUSPENDED' as any)} className="rounded-xl px-4 py-3 cursor-pointer">
                              <Pause size={16} className="mr-3 text-yellow-500" />
                              <span className="text-xs font-bold">Suspendre</span>
                            </DropdownMenuItem>
                          )}

                          {shop.status !== 'ARCHIVED' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(shop.id, 'ARCHIVED' as any)} className="rounded-xl px-4 py-3 cursor-pointer">
                              <Archive size={16} className="mr-3 text-slate-500" />
                              <span className="text-xs font-bold">Archiver</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => {
                              setShopToDelete(shop)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="rounded-xl px-4 py-3 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-3" />
                            <span className="text-xs font-bold">Suppression définitive</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredShops.length === 0 && (
            <div className="py-20 text-center">
               <AlertTriangle size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
               <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-xs">Aucune boutique trouvée</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[40px] border-none p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-primary">Suppression Critique</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium py-4">
              Attention : vous êtes sur le point de supprimer définitivement la boutique <span className="font-black text-primary">"{shopToDelete?.name}"</span>. 
              Cette action est irréversible et supprimera également tous les produits associés.
              <br/><br/>
              <span className="text-red-600 font-bold block bg-red-50 p-4 rounded-2xl border border-red-100 italic">
                Une boutique ayant des commandes ou un historique financier ne peut pas être supprimée.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel className="rounded-full px-8 py-6 h-auto border-2 border-slate-100 font-bold uppercase text-[10px] tracking-widest">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (shopToDelete) handleDelete(shopToDelete.id)
                setIsDeleteDialogOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 h-auto font-black uppercase text-[10px] tracking-widest"
            >
              Confirmer la Suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
