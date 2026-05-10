import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getCookieDomain } from '../utils/cookies'

export async function createSharedServerClient() {
  const cookieStore = await cookies()
  const domain = getCookieDomain()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (domain) {
                // Legacy Cookie Cleanup: Si un domaine wildcard est utilisé, on s'assure
                // de supprimer l'ancien cookie potentiellement lié au nom de domaine exact
                // pour éviter les conflits où le navigateur enverrait les deux cookies.
                cookieStore.set(name, '', { 
                  ...options, 
                  domain: undefined, 
                  maxAge: 0,
                  expires: new Date(0)
                });
              }
              
              // On pose le nouveau cookie avec le domaine partagé (ou undefined en local)
              cookieStore.set(name, value, { 
                ...options, 
                domain 
              });
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
