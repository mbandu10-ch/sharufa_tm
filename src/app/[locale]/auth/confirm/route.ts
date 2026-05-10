import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/resend'
import { WelcomeEmail } from '@/components/emails/WelcomeEmail'
import { getBaseUrl } from '@/lib/config'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

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
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/auth/auth-code-error'
  return NextResponse.redirect(redirectTo)
}
