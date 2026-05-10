'use server'

import { sendEmail } from '@/lib/resend'
import { SellerInvitationEmail } from '@/components/emails/SellerInvitationEmail'
import { getBaseUrl } from '@/lib/config'
import { requireRole } from '@/lib/auth-guard'

export async function inviteSeller(formData: FormData) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  const email = formData.get('email') as string
  const sellerName = formData.get('sellerName') as string || 'Partenaire'
  const method = formData.get('method') as 'EMAIL' | 'WHATSAPP'
  
  const baseUrl = getBaseUrl()
  const registerLink = `${baseUrl}/register?type=seller&ref=admin_invite`

  if (method === 'EMAIL') {
    if (!email) {
      return { error: 'Une adresse e-mail est requise pour l\'envoi par e-mail.' }
    }

    try {
      await sendEmail({
        to: email,
        subject: `Invitation à rejoindre Sharufa, ${sellerName}`,
        react: SellerInvitationEmail({
          sellerName: sellerName,
          sellerLink: registerLink
        })
      })

      return { 
        success: true, 
        message: 'Invitation envoyée par e-mail avec succès !',
        link: registerLink 
      }
    } catch (error) {
      console.error('Error sending invitation email:', error)
      return { error: 'Erreur lors de l\'envoi de l\'e-mail d\'invitation.' }
    }
  }

  // For WhatsApp, we just return the link so the frontend can open wa.me
  return { 
    success: true, 
    link: registerLink,
    message: 'Lien d\'invitation généré pour WhatsApp.' 
  }
}
