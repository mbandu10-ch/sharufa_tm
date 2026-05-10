import React from 'react'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { redirect } from 'next/navigation'
import { prisma } from '@sharufa/db'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

/**
 * Layout Admin avec double garde de sécurité :
 * 1. Middleware (proxy.ts) → vérifie l'authentification Supabase
 * 2. Ce layout → vérifie le rôle ADMIN dans la base de données
 * 
 * Aucun utilisateur non-ADMIN ne peut accéder au contenu admin.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Normalement géré par le middleware, mais double sécurité
    redirect('https://login.sharufa.com/login')
  }

  // GARDE CRITIQUE : Vérifier le rôle ADMIN dans la base
  const profile = await prisma.profile.findUnique({ 
    where: { id: user.id } 
  })
  
  if (profile?.role !== 'ADMIN') {
    // Rediriger tout non-admin vers le site principal
    // Aucune exposition de données admin
    redirect('https://sharufa.com/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      
      <main className="lg:pl-72 min-h-screen transition-all duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#002B24] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-3">
              <AdminSidebar isMobile />
           </div>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary text-[10px] font-black uppercase">
                 AD
              </div>
           </div>
        </div>

        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
