import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales } from '@sharufa/shared'

// Note: On importe depuis @root pour la phase de migration
import { getAuthRedirectUrl } from '../../src/lib/auth-config'

const intlMiddleware = createIntlMiddleware({
  locales: locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed'
});

export default async function middleware(request: NextRequest) {
  // 1. i18n
  const response = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;

  // Routes publiques (landing, register) qui ne nécessitent pas d'être VENDOR
  const publicPaths = ['/', '/register', '/auth'];
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname === `/fr${path}` || pathname === `/en${path}` || pathname === `/tr${path}`
  );

  // 2. Supabase Auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser();

  // 3. Protection
  if (!user && !isPublicPath) {
    const returnTo = request.url;
    // On redirige vers le portail d'authentification centralisé
    return NextResponse.redirect(getAuthRedirectUrl('/login', returnTo));
  }

  // Note: Le check de rôle VENDOR est fait dans le Layout Server Component 
  // pour éviter des appels DB trop fréquents ou complexes dans le middleware Edge.

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
