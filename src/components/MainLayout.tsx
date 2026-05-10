"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { cn } from "@/lib/utils"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Account for locale prefix (e.g. /fr/dashboard)
  const isDashboard = pathname?.includes("/dashboard") || pathname?.includes("/admin")
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register") || pathname?.includes("/forgot-password")
  
  const hideLayout = isDashboard || isAuthPage

  return (
    <div className={cn(
      "font-inter min-h-full flex flex-col",
      !hideLayout && "pt-20 md:pt-24"
    )}>
      {!hideLayout && <Navbar />}
      <main className={cn("flex-grow", isAuthPage && "h-screen overflow-hidden")}>{children}</main>
      {!hideLayout && <Footer />}
    </div>
  )
}
