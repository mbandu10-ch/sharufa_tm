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
  CreditCard,
  Truck,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { createSharedBrowserClient as createClient } from '@sharufa/auth/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const sellerMenuItems = [
  { name: 'Dashboard Vendeur', href: '/dashboard/seller', icon: LayoutDashboard },
  { name: 'Produits', href: '/dashboard/seller/products', icon: Package },
  { name: 'Commandes', href: '/dashboard/seller/orders', icon: ShoppingBag },
  { name: 'Ma Boutique', href: '/dashboard/seller/shop', icon: Store },
  { name: 'Conformité', href: '/dashboard/seller/compliance', icon: ShieldCheck },
  { name: 'Finances', href: '/dashboard/seller/finances', icon: CreditCard },
  { name: 'Paramètres', href: '/dashboard/seller/settings', icon: Settings },
]

interface SellerSidebarProps {
  profile: any
  hasShop: boolean
  isMobile?: boolean
}

export function SellerSidebar({ profile, hasShop, isMobile }: SellerSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Déconnexion réussie')
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-primary text-white">
      {/* Header / Logo */}
      <div className="p-8 pb-12">
        <Link href="/" className="block">
          <Logo />
          <span className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] mt-2 block opacity-80">
            Espace Vendeur
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {sellerMenuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-secondary text-primary shadow-xl shadow-secondary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-transform group-hover:scale-110",
                isActive ? "text-primary" : "text-secondary"
              )} />
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill-seller"
                  className="absolute right-4"
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
      <div className="p-6 border-t border-white/5 mt-auto">
         <div className="bg-white/5 rounded-3xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-1">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                 Boutique Active
               </span>
            </div>
            <p className="text-sm font-bold text-white truncate">
              {profile?.shop?.name || 'Ma Boutique'}
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
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger className="p-2 -ml-2 text-primary hover:bg-slate-50 rounded-xl transition-colors">
          <Menu size={24} />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-none bg-primary">
           <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-primary border-r border-white/10 z-50 hidden lg:flex flex-col">
      <SidebarContent />
    </aside>
  )
}
