"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart, User as IconUser, Search, Menu, X, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@sharufa/ui/components/button";
import { Logo } from "@sharufa/ui/components/Logo";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/i18n-navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sharufa/ui/components/dropdown-menu";
import { createSharedBrowserClient as createClient } from '@sharufa/auth/client';
import { toast } from "sonner";
import { useCart } from "@/lib/store/useCart";
import CartDrawer from "@/components/cart/CartDrawer";
import LanguageSwitcher from "@sharufa/ui/components/LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const supabase = createClient();

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("marketplace"), href: "/marketplace" },
    { name: t("buy_for_me"), href: "/buy-for-me" },
    { name: t("logistics"), href: "/logistics" },
    { name: t("about"), href: "/about" },
    { name: t("sell"), href: "/seller" },
  ];

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(t("logout_success"));
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 md:h-24 items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-16">
            <Link href="/" className="transition-all hover:scale-105 shrink-0">
              <Logo />
            </Link>
            
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8 text-[10px] lg:text-[11px] font-black uppercase tracking-wide h-full">
              {navLinks.map((link) => {
                const isActive = pathname === `/${locale}${link.href === "/" ? "" : link.href}` || (link.href !== "/" && pathname?.includes(link.href));
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "h-full flex items-center transition-all hover:text-secondary whitespace-nowrap relative",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="hidden lg:flex items-center bg-muted/50 rounded-2xl px-4 py-2 border group transition-all focus-within:ring-2 focus-within:ring-secondary/20">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-secondary" />
              <input
                type="text"
                placeholder={t("search")}
                className="bg-transparent border-none focus:ring-0 text-xs w-32 xl:w-48 ml-2 placeholder:text-muted-foreground font-bold"
              />
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(true)}
              className="relative hover:bg-secondary/10 hover:text-secondary transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-primary text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                  {totalItems()}
                </span>
              )}
            </Button>
            
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
                )}
              >
                <IconUser className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-border">
                <DropdownMenuGroup>
                  {user ? (
                    <>
                      <DropdownMenuLabel className="font-outfit font-black text-primary px-3 py-2 uppercase tracking-tighter text-lg">
                         {t("account")}
                      </DropdownMenuLabel>
                      <div className="px-3 pb-3 text-[10px] text-muted-foreground font-bold truncate">
                         {user.email}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="rounded-xl py-3 cursor-pointer group">
                        <Link href="/dashboard" className="flex items-center w-full font-bold text-sm">
                          <LayoutDashboard className="mr-3 h-4 w-4 text-secondary" /> {t("dashboard")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl py-3 cursor-pointer">
                        <Link href="/dashboard/settings" className="flex items-center w-full font-bold text-sm">
                          <Settings className="mr-3 h-4 w-4 text-secondary" /> {t("settings")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="rounded-xl py-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-bold text-sm"
                      >
                        <LogOut className="mr-3 h-4 w-4" /> {t("logout")}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel className="font-outfit font-black text-primary px-3 py-2 uppercase tracking-tighter text-lg">
                         {t("welcome")}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="rounded-xl py-3 cursor-pointer group">
                        <Link href="/login" className="flex items-center w-full font-bold text-sm group-hover:text-secondary transition-colors">
                          {t("login")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl py-3 cursor-pointer group">
                        <Link href="/register" className="flex items-center w-full font-bold text-sm group-hover:text-secondary transition-colors">
                          {t("register")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-80px)] overflow-y-auto border-t py-6 px-6 space-y-6 bg-background animate-in slide-in-from-top duration-300 shadow-2xl z-50">
          {navLinks.map((link) => {
            const isActive = pathname === `/${locale}${link.href === "/" ? "" : link.href}` || (link.href !== "/" && pathname?.includes(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-xl font-black uppercase tracking-widest ${
                  isActive ? "text-secondary" : "text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-6 border-t space-y-4">
            {user ? (
               <Button 
                 onClick={handleLogout}
                 variant="ghost"
                 className="px-0 py-4 text-red-600 font-black uppercase tracking-widest text-xl hover:bg-transparent"
               >
                 {t("logout")}
               </Button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-4 text-secondary font-black uppercase tracking-widest text-lg"
              >
                {t("login")}
              </Link>
            )}
            <div className="pt-4 border-t">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Langue / Language</p>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
      
      <CartDrawer />
    </nav>
  );
}
