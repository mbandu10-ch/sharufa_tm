import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createSharedServerClient as createClient, getSafeReturnTo } from '@sharufa/auth/server'
import { prisma } from '@root/lib/prisma'
import { sendEmail, WelcomeEmail } from '@sharufa/emails'
import { getBaseUrl } from '@root/lib/config'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'
  
  const safeNext = getSafeReturnTo(next, '/dashboard')

  let redirectUrl = safeNext;
  if (safeNext.startsWith('/') && !safeNext.startsWith('//')) {
    const url = request.nextUrl.clone()
    url.pathname = safeNext
    url.searchParams.delete('token_hash')
    url.searchParams.delete('type')
    url.searchParams.delete('next')
    redirectUrl = url.href
  }

  if (token_hash && type) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error && data.user) {
      // 1. Send Welcome Email via Resend AFTER successful confirmation (only for signup)
      if (type === 'signup') {
        try {
          const profile = await prisma.profile.findUnique({
            where: { id: data.user.id },
            select: { firstName: true, email: true }
          })

          if (profile && profile.email) {
            await sendEmail({
              to: profile.email,
              subject: `Bienvenue chez Sharufa, ${profile.firstName || ''}`,
              react: WelcomeEmail({
                firstName: profile.firstName || 'Acheteur',
                dashboardLink: `${getBaseUrl()}/dashboard`
              })
            })
          }
        } catch (emailError) {
          console.error('Error sending welcome email after confirmation:', emailError)
          // We don't block the redirect if email fails
        }
      }

      // 2. Redirect to success page or dashboard
      return NextResponse.redirect(redirectUrl)
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
