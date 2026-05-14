import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['fr', 'en', 'tr'];

const intlMiddleware = createIntlMiddleware({
  locales: locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed'
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  
  // Standalone flags from env
  const useStandaloneAuth = process.env.NEXT_PUBLIC_USE_STANDALONE_AUTH === 'true';
  const authPortalUrl = process.env.NEXT_PUBLIC_AUTH_PORTAL_URL || 'http://localhost:3001';
  
  const useStandaloneSeller = process.env.NEXT_PUBLIC_USE_STANDALONE_SELLER === 'true';
  const sellerPortalUrl = process.env.NEXT_PUBLIC_SELLER_PORTAL_URL || 'http://localhost:3002';

  const useStandaloneAdmin = process.env.NEXT_PUBLIC_USE_STANDALONE_ADMIN === 'true';
  const adminPortalUrl = process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3003';

  const useStandaloneWeb = process.env.NEXT_PUBLIC_USE_STANDALONE_WEB === 'true';
  const webPortalUrl = process.env.NEXT_PUBLIC_WEB_PORTAL_URL || 'http://localhost:3000';

  // Helper to remove locale prefix
  const currentPath = pathname.replace(/^\/(fr|en|tr)/, '') || '/';

  // 1. Redirection Auth
  if (useStandaloneAuth) {
    const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback', '/auth/confirm'];
    if (authPaths.includes(currentPath)) {
      const url = new URL(currentPath, authPortalUrl);
      searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
  }

  // 2. Redirection Seller
  if (useStandaloneSeller) {
    if (currentPath === '/seller' || currentPath.startsWith('/seller/')) {
      const subPath = currentPath === '/seller' ? '/' : currentPath.replace('/seller', '');
      const url = new URL(subPath, sellerPortalUrl);
      searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
    if (currentPath.startsWith('/dashboard/seller')) {
      const subPath = currentPath.replace('/dashboard/seller', '/dashboard');
      const url = new URL(subPath, sellerPortalUrl);
      searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
  }

  // 3. Redirection Admin
  if (useStandaloneAdmin) {
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      const url = new URL(currentPath, adminPortalUrl);
      searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
  }

  // 4. Standalone Web Loop Prevention
  if (useStandaloneWeb) {
    const url = new URL(pathname, webPortalUrl);
    if (request.headers.get('host') !== url.host) {
      searchParams.forEach((value, key) => url.searchParams.set(key, value));
      return NextResponse.redirect(url.toString());
    }
  }

  // 5. Default to i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
}
