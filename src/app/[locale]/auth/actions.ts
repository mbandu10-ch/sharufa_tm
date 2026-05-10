'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/resend'
import { ConfirmEmail } from '@/components/emails/ConfirmEmail'
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail'
import { getBaseUrl } from '@/lib/config'
import { checkRateLimit } from '@/lib/rate-limit'


export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = formData.get('next') as string || null

  // Rate Limiting
  const rateLimit = await checkRateLimit(email, 'auth')
  if (!rateLimit.allowed) {
    return { error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
  }


  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const errorUrl = new URL('/login', getBaseUrl()) // Dynamic URL
    errorUrl.searchParams.set('error', error.message)
    if (next && next !== '/dashboard') errorUrl.searchParams.set('next', next)
    return redirect(errorUrl.pathname + errorUrl.search)
  }

  // Se souvenir de revalider la page pour mettre à jour les headers/sessions
  revalidatePath('/', 'layout')

  // Récupérer le rôle de l'utilisateur pour une redirection intelligente
  let userRole: 'ADMIN' | 'VENDOR' | 'CLIENT' | 'CARGO' = 'CLIENT'
  if (data.user) {
    const profile = await prisma.profile.findUnique({
      where: { id: data.user.id },
      select: { role: true }
    })
    if (profile?.role) userRole = profile.role as 'ADMIN' | 'VENDOR' | 'CLIENT' | 'CARGO'
  }

  // 1. Priorité AU CONTENU si présent dans "next" (ex: retour produit après login)
  // On n'autorise "next" que pour les pages de contenu public
  if (next && next !== '/dashboard' && next !== '/seller' && next !== '/admin' && next !== '/cargo') {
    const isPublicContent = next.startsWith('/product') || 
                            next.startsWith('/marketplace') || 
                            next.startsWith('/buy-for-me') || 
                            next.startsWith('/logistics')
    
    if (isPublicContent) {
      return redirect(next)
    }
  }

  // 2. Sinon, redirection STRICTE basée sur le rôle
  if (userRole === 'ADMIN') {
    return redirect('/admin')
  }

  if (userRole === 'VENDOR') {
    return redirect('/seller')
  }

  if (userRole === 'CARGO') {
    return redirect('/cargo')
  }

  // 3. Fallback par défaut vers le dashboard client (Acheteur)
  redirect('/dashboard')
}



export async function signup(formData: FormData) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const next = formData.get('next') as string || '/dashboard'

  // Rate Limiting
  const rateLimit = await checkRateLimit(email, 'auth')
  if (!rateLimit.allowed) {
    return { error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
  }


  // 1. Create user via Admin API (to avoid auto-sending Supabase email)
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    user_metadata: { 
      first_name: firstName, 
      last_name: lastName 
    },
    email_confirm: false
  })

  if (error) {
    if (error.message.includes('commonly used passwords') || error.message.includes('pwned')) {
      return { error: 'Ce mot de passe a été compromis dans une fuite de données. Veuillez en choisir un autre.' }
    }
    return { error: error.message }
  }

  // 2. Generate custom confirmation link
  const baseUrl = getBaseUrl()
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'signup',
    email: email,
    password: password,
    options: { 
      redirectTo: `${baseUrl}/auth/confirm?next=${encodeURIComponent(next)}` 
    }
  })

  if (linkError || !linkData.properties?.hashed_token) {
    console.error('Error generating confirm link:', linkError)
    // fallback or error
  } else {
    // 3. Send premium confirmation email via Resend
    // Point to our custom confirmation route to trigger Welcome Email
    const confirmUrl = `${baseUrl}/auth/confirm?token_hash=${linkData.properties.hashed_token}&type=signup&next=${encodeURIComponent(next)}`
    
    await sendEmail({
      to: email,
      subject: `Activez votre compte Sharufa, ${firstName}`,
      react: ConfirmEmail({
        firstName,
        confirmLink: confirmUrl
      })
    })
  }

  // Create profile in Prisma if user is created
  if (data.user) {
    try {
      await prisma.profile.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          firstName,
          lastName,
          role: 'CLIENT',
          vendorStatus: 'NONE',
        },
      })
    } catch (e) {
      console.error('Error creating profile:', e)
    }
  }

  revalidatePath('/', 'layout')
  
  return { success: true, message: 'Un e-mail de confirmation premium vous a été envoyé. Veuillez vérifier votre boîte de réception.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string
  const adminClient = createAdminClient()
  const baseUrl = getBaseUrl()

  // Rate Limiting
  const rateLimit = await checkRateLimit(email, 'auth')
  if (!rateLimit.allowed) {
    return { error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
  }


  // 1. Check if profile exists (optional but good for feedback)
  const profile = await prisma.profile.findUnique({
    where: { email },
    select: { firstName: true }
  })

  if (!profile) {
    // We don't want to leak if an email exists, so we return success anyway
    return { success: true, message: 'Si un compte existe pour cet e-mail, un lien de réinitialisation sera envoyé.' }
  }

  // 2. Generate recovery link
  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'recovery',
    email: email,
    options: { 
      redirectTo: `${baseUrl}/auth/confirm?type=recovery&next=/reset-password` 
    }
  })

  if (linkError || !linkData.properties?.hashed_token) {
    console.error('Error generating recovery link:', linkError)
    return { error: 'Erreur lors de la génération du lien de réinitialisation.' }
  }

  // 3. Send premium reset email via Resend
  const resetUrl = `${baseUrl}/auth/confirm?token_hash=${linkData.properties.hashed_token}&type=recovery&next=/reset-password`
  
  await sendEmail({
    to: email,
    subject: `Réinitialisation de votre mot de passe Sharufa`,
    react: ResetPasswordEmail({
      firstName: profile.firstName || 'Acheteur',
      resetLink: resetUrl
    })
  })

  return { success: true, message: 'Un e-mail de réinitialisation premium vous a été envoyé. Veuillez vérifier votre boîte de réception.' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return { error: 'Les mots de passe ne correspondent pas.' }
  }

  if (password.length < 8) {
    return { error: 'Le mot de passe doit contenir au moins 8 caractères.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    if (error.message.includes('commonly used passwords') || error.message.includes('pwned')) {
      return { error: 'Ce mot de passe a été compromis dans une fuite de données passée. Veuillez en choisir un autre.' }
    }
    if (error.message.includes('should be at least')) {
      return { error: 'Le mot de passe doit contenir au moins 8 caractères.' }
    }
    return { error: error.message }
  }

  return { success: true, message: 'Votre mot de passe a été mis à jour avec succès.' }
}
