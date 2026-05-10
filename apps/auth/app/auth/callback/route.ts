import { NextResponse } from 'next/server'
import { createSharedServerClient as createClient, getSafeReturnTo } from '@sharufa/auth/server'
import { getBaseUrl } from '@root/lib/config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const safeNext = getSafeReturnTo(next, '/dashboard')
      // If safeNext is a relative path, we prepend getBaseUrl(). If it's absolute, we use it directly.
      const redirectUrl = safeNext.startsWith('/') ? `${getBaseUrl()}${safeNext}` : safeNext
      return NextResponse.redirect(redirectUrl)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
