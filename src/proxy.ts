import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getAuthRedirectUrl, AUTH_CONFIG } from '@/lib/auth-config'
import createIntlMiddleware from 'next-intl/middleware';

export const locales = ['fr', 'en', 'tr'];

const intlMiddleware = createIntlMiddleware({
  locales: locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed'
});

export default async function proxy(request: NextRequest) {
  // 1. Handle i18n first
  const response = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;

  // 2. MODULAR REDIRECTIONS (Redirection vers les portails spécialisés)

  // 2a. Redirection Seller
  if (AUTH_CONFIG.USE_STANDALONE_SELLER) {
    const currentPath = pathname.replace(/^\/(fr|en|tr)/, '');
    if (currentPath === '/seller' || currentPath.startsWith('/seller/')) {
      const subPath = currentPath === '/seller' ? '/' : currentPath.replace('/seller', '');
      const url = new URL(subPath, AUTH_CONFIG.SELLER_PORTAL_URL);
      request.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
    if (currentPath.startsWith('/dashboard/seller')) {
      const subPath = currentPath.replace('/dashboard/seller', '/dashboard');
      const url = new URL(subPath, AUTH_CONFIG.SELLER_PORTAL_URL);
      request.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
  }

  // 2b. Redirection Admin
  if (AUTH_CONFIG.USE_STANDALONE_ADMIN) {
    const currentPath = pathname.replace(/^\/(fr|en|tr)/, '');
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      const url = new URL(currentPath, AUTH_CONFIG.ADMIN_PORTAL_URL);
      request.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
  }

  // 2c. Redirection Cargo
  if (AUTH_CONFIG.USE_STANDALONE_CARGO) {
    const currentPath = pathname.replace(/^\/(fr|en|tr)/, '');
    if (currentPath === '/cargo' || currentPath.startsWith('/cargo/')) {
      const url = new URL(currentPath, AUTH_CONFIG.CARGO_PORTAL_URL);
      request.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
  }

  // 2d. Redirection Auth
  if (AUTH_CONFIG.USE_STANDALONE_AUTH) {
    const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback', '/auth/confirm'];
    const currentPath = pathname.replace(/^\/(fr|en|tr)/, '');
    if (authPaths.includes(currentPath)) {
      const portalUrl = new URL(getAuthRedirectUrl(currentPath));
      request.nextUrl.searchParams.forEach((value, key) => portalUrl.searchParams.set(key, value));
      return NextResponse.redirect(portalUrl.toString());
    }
  }

  // 3. OPTIONAL: Final Redirection to Standalone Web (Port 3000)
  // On ne l'active que si on veut forcer le port 3000 localement via le proxy.
  // En production, c'est l'orchestrateur qui s'en charge.
  const isStandaloneWebEnabled = process.env.NEXT_PUBLIC_USE_STANDALONE_WEB === 'true';
  const webPortalUrl = process.env.NEXT_PUBLIC_WEB_PORTAL_URL || 'http://localhost:3000';

  if (isStandaloneWebEnabled) {
    const currentPath = pathname;
    const url = new URL(currentPath, webPortalUrl);
    request.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
    return NextResponse.redirect(url.toString());
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
}
