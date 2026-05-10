'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  ChevronRight,
  LogOut,
  Store,
  BarChart3,
  CreditCard,
  Truck,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@sharufa/ui/components/Logo'
import { createSharedBrowserClient as createClient } from '@sharufa/auth/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


const sellerMenuItems = [
  { name: 'Dashboard Vendeur', href: '/dashboard/seller', icon: LayoutDashboard },
  { name: 'Produits', href: '/dashboard/seller/products', icon: Package },
  { name: 'Commandes', href: '/dashboard/seller/orders', icon: ShoppingBag },
  { name: 'Ma Boutique', href: '/dashboard/seller/shop', icon: Store },
  { name: 'Conformité', href: '/dashboard/seller/compliance', icon: ShieldCheck },
  { name: 'Finances', href: '/dashboard/seller/finances', icon: CreditCard },
  { name: 'Paramètres', href: '/dashboard/seller/settings', icon: Settings },
]

const buyerMenuItems = [
  { name: 'Mon Dashboard', href: '/dashboard/buyer', icon: LayoutDashboard },
  { name: 'Mes Achats', href: '/dashboard/buyer/orders', icon: ShoppingBag },
  { name: 'Buy For Me', href: '/dashboard/buyer/sourcing', icon: Package },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Paramètres', href: '/dashboard/buyer/settings', icon: Settings },
]

const cargoMenuItems = [
  { name: 'Manifeste Cargo', href: '/cargo', icon: LayoutDashboard },
  { name: 'Alertes Expédition', href: '/cargo', icon: Truck },
]

interface DashboardSidebarProps {
  profile: any
  hasShop: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function DashboardSidebar({ profile, hasShop, isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const isSeller = profile?.role === 'VENDOR' || hasShop
  const isCargo = profile?.role === 'CARGO'
  
  const menuItems = isCargo ? cargoMenuItems : (isSeller ? sellerMenuItems : buyerMenuItems)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Déconnexion réussie')
    router.push('/')
    router.refresh()
  }

  // Empêcher le scroll quand le menu est ouvert sur mobile
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-primary border-r border-white/10 flex flex-col transition-all duration-500 ease-in-out z-[70] overflow-hidden group",
        "w-72 lg:w-20 lg:hover:w-72 lg:translate-x-0",
        isOpen ? "translate-x-0 shadow-2xl shadow-black/50" : "-translate-x-full"
      )}>
        {/* Header / Logo */}
        <div className="p-6 pb-10 relative shrink-0">
          <Link href="/" className="flex items-center gap-4">
            <div className="shrink-0">
              <Logo />
            </div>
            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <span className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] opacity-80">
                Espace {isSeller ? 'Vendeur' : 'Acheteur'}
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-4 p-2 text-white/40 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group/item relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-secondary text-primary shadow-xl shadow-secondary/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="shrink-0 w-6 flex justify-center">
                  <item.icon size={22} className={cn(
                    "transition-transform group-hover/item:scale-110",
                    isActive ? "text-primary" : "text-secondary"
                  )} />
                </div>
                
                <span className={cn(
                  "font-bold text-sm tracking-tight whitespace-nowrap transition-all duration-300",
                  "opacity-0 group-hover:opacity-100"
                )}>
                  {item.name}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/5">
           <div className="bg-white/5 rounded-3xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-1">
                 <div className={cn(
                   "w-2 h-2 rounded-full animate-pulse",
                   isSeller ? "bg-green-500" : "bg-blue-500"
                 )} />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {profile?.role === 'CARGO' ? 'Compte Cargo' : (isSeller ? 'Boutique Active' : 'Compte Acheteur')}
                  </span>
               </div>
               <p className="text-sm font-bold text-white truncate">
                 {profile?.role === 'CARGO' ? (profile?.cargo?.name || 'Partenaire Cargo') : (isSeller ? (hasShop ? profile?.shop?.name || 'Ma Boutique' : 'Sharufa Partner') : `${profile?.firstName} ${profile?.lastName}`)}
               </p>
           </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
             <LogOut size={20} />
             <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  )
}
