
"use client";

import { Home, Grid, ShoppingCart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/lib/i18n-navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/useCart";
import { useEffect, useState } from "react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const { totalItems, setIsOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: t("home"), href: "/", icon: Home },
    { name: t("marketplace"), href: "/marketplace", icon: Grid },
    { name: "Panier", href: "#", icon: ShoppingCart, isCart: true },
    { name: t("account"), href: "/dashboard", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.href !== "#" && (pathname === `/${locale}${item.href === "/" ? "" : item.href}` || (item.href !== "/" && pathname?.includes(item.href)));
          
          if (item.isCart) {
            return (
              <button
                key="mobile-cart"
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center justify-center gap-1 w-full relative"
              >
                <div className={cn(
                  "p-1 rounded-xl transition-all duration-300",
                  "text-slate-500"
                )}>
                  <item.icon size={22} />
                  {mounted && totalItems() > 0 && (
                    <span className="absolute top-0 right-[25%] bg-secondary text-primary text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-lg border border-white">
                      {totalItems()}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 w-full"
            >
              <div className={cn(
                "p-1 rounded-xl transition-all duration-300",
                isActive ? "text-secondary" : "text-slate-500"
              )}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-tighter transition-colors",
                isActive ? "text-secondary" : "text-slate-500"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
