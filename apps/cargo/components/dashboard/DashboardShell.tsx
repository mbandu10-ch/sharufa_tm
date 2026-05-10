'use client'

import React, { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { Menu, X, Bell, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface DashboardShellProps {
  children: React.ReactNode
  profile: any
  hasShop: boolean
}

export function DashboardShell({ children, profile, hasShop }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Handles its own responsive logic */}
      <DashboardSidebar 
        profile={profile} 
        hasShop={hasShop} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-500",
        "lg:pl-20" // Reduced padding for narrow sidebar
      )}>
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 lg:hidden">
          <div className="flex items-center justify-between px-6 h-20">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center gap-4">
               <Link 
                 href={profile?.role === 'VENDOR' ? '/dashboard/seller/settings' : (profile?.role === 'CARGO' ? '/cargo/settings' : '/dashboard/buyer/settings')}
                 className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black text-xs uppercase hover:bg-secondary/20 transition-colors"
               >
                  {profile?.firstName?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                  {profile?.lastName?.charAt(0) || ''}
               </Link>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto">
          <div className="px-6 py-8 md:px-12 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
