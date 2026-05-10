import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales } from '@sharufa/shared'

const intlMiddleware = createIntlMiddleware({
  locales: locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed'
});

export default async function middleware(request: NextRequest) {
  // 1. i18n
  const response = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;

  // 2. Supabase Auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser();

  // 3. Protection - toutes les routes /cargo nécessitent d'être connecté
  // Note: On ne redirige pas si on est déjà sur le portail auth standalone
  if (!user) {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_PORTAL_URL || 'https://login.sharufa.com';
    const returnTo = request.url;
    return NextResponse.redirect(`${authUrl}/login?next=${encodeURIComponent(returnTo)}`);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',],
}
