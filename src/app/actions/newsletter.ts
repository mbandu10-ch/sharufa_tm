'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
import { checkRateLimit } from '@/lib/rate-limit'


export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { error: 'Veuillez entrer une adresse email valide.' }
  }

  // Rate Limiting
  const rateLimit = await checkRateLimit(email, 'newsletter')
  if (!rateLimit.allowed) {
    return { error: `Trop de tentatives d'inscription. Veuillez réessayer plus tard.` }
  }


  try {
    // In a real scenario, you'd add this to a Resend audience
    // For now, we'll send a confirmation email or just log it
    
    // Example: send a welcome email
    await resend.emails.send({
      from: 'Sharufa <noreply@sharufa.com>',
      to: email,
      subject: 'Bienvenue chez Sharufa !',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1a1a1a;">
          <h1 style="color: #000;">Bienvenue chez Sharufa !</h1>
          <p>Merci de vous être inscrit à notre newsletter.</p>
          <p>Vous recevrez désormais nos meilleures offres et actualités sur nos catalogues Dubaï, Turquie et Chine.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Sharufa.com</p>
        </div>
      `
    })

    return { success: 'Votre inscription a été prise en compte !' }
  } catch (error) {
    console.error('Newsletter error:', error)
    return { error: "Une erreur est survenue lors de l'inscription." }
  }
}
