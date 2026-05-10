'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Store, 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Search, 
  CreditCard, 
  Settings, 
  ChevronRight,
  LogOut,
  Bell,
  Menu,
  X,
  Truck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const adminMenuItems = [
  { name: "Vue d'ensemble", href: '/admin', icon: LayoutDashboard },
  { name: 'Boutiques', href: '/admin/shops', icon: Store },
  { name: 'Conformité', href: '/admin/compliance', icon: ShieldCheck },
  { name: 'Logistique (Cargos)', href: '/admin/cargos', icon: Truck },
  { name: 'Produits', href: '/admin/products', icon: Package },
  { name: 'Commandes', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Sourcing', href: '/admin/sourcing', icon: Search },
  { name: 'Finances', href: '/admin/finance', icon: CreditCard },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  isMobile?: boolean
}

export function AdminSidebar({ isMobile }: AdminSidebarProps) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#002B24] text-white">
      {/* Header / Logo */}
      <div className="p-8 pb-12">
        <Link href="/" className="block">
          <Logo />
          <span className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] mt-2 block opacity-80">
            Centre de Pilotage Global
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {adminMenuItems.map((item) => {
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href)

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-secondary text-primary shadow-xl shadow-secondary/10" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-transform group-hover:scale-110",
                isActive ? "text-primary" : "text-secondary opacity-70 group-hover:opacity-100"
              )} />
              <span className="font-bold text-xs tracking-tight">{item.name}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill-admin-global"
                  className="absolute right-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ChevronRight size={14} />
                </motion.div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Alerts */}
      <div className="p-6 border-t border-white/5 mt-auto">
         <Link href="/admin/compliance/alerts" className="block p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6 group hover:bg-orange-500/20 transition-all">
            <div className="flex items-center gap-2 mb-1">
               <Bell size={14} className="text-orange-400 group-hover:animate-bounce" />
               <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Alertes Rapport</span>
            </div>
            <p className="text-[11px] font-bold text-white/80 leading-tight">Vérifiez les licences expirées aujourd'hui.</p>
         </Link>

        <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-300/60 hover:text-red-300 hover:bg-red-500/10 transition-all font-bold text-xs">
           <LogOut size={18} />
           <span>Quitter Administration</span>
        </button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger className="p-2 -ml-2 text-secondary hover:bg-white/5 rounded-xl transition-colors">
          <Menu size={24} />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-none bg-[#002B24]">
           <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#002B24] border-r border-white/5 z-50 hidden lg:flex flex-col">
      <SidebarContent />
    </aside>
  )
}
