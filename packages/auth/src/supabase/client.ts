import { createBrowserClient } from '@supabase/ssr'
import { getCookieDomain } from '../utils/cookies'

export function createSharedBrowserClient() {
  const domain = getCookieDomain()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: domain,
        // path, maxAge, sameSite, secure... are handled by default or can be explicitly set
      }
    }
  )
}
