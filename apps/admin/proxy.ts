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

  // 2. Supabase Auth — TOUTES les routes du portail admin nécessitent une authentification
  // Pas de routes publiques sur le portail admin (contrairement au seller qui a /register)
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

  // 3. Protection — aucune route publique sur le portail admin
  if (!user) {
    const returnTo = request.url;
    // Redirection vers le portail d'authentification centralisé
    return NextResponse.redirect(getAuthRedirectUrl('/login', returnTo));
  }

  // Note: Le check de rôle ADMIN est fait dans le Layout Server Component
  // car l'Edge Runtime ne supporte pas les drivers DB (Prisma/pg).
  // Le middleware garantit uniquement l'authentification.

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
