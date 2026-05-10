'use server'

import { prisma } from "@/lib/prisma"
import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"
import { ShopDocumentType, ShopDocumentStatus, ShopVerificationStatus } from "@prisma/client"
import { sendEmail } from "@/lib/resend"
import { ComplianceDossierReceivedEmail } from "@/components/emails/ComplianceDossierReceivedEmail"
import { requireShopOwner } from "@/lib/auth-guard"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sharufa.com'
import { checkRateLimit } from '@/lib/rate-limit'


/**
 * Met à jour les informations légales d'une boutique (RIB, Licence, etc.)
 */
export async function updateShopLegalProfile(shopId: string, data: {
  legalBusinessName?: string,
  tradeLicenseNumber?: string,
  tradeLicenseCountry?: string,
  tradeLicenseIssueDate?: Date,
  tradeLicenseExpiryDate?: Date,
  vatNumber?: string,
  bankAccountName?: string,
  bankName?: string,
  iban?: string,
  swiftCode?: string,
}) {
  const auth = await requireShopOwner(shopId)
  if (auth.error) return { error: auth.error }

  try {
    const profile = await prisma.shopLegalProfile.upsert({
      where: { shopId },
      update: data,
      create: {
        shopId,
        ...data
      }
    })

    // Log the compliance event
    await prisma.shopComplianceEvent.create({
      data: {
        shopId,
        eventType: "LEGAL_PROFILE_UPDATED",
        message: "Les informations légales de l'entreprise ont été mises à jour."
      }
    })

    revalidatePath('/seller/dashboard/compliance')
    return { success: true, profile }
  } catch (error: any) {
    console.error('Error updating shop legal profile:', error)
    return { error: 'Échec de la mise à jour des informations légales.' }
  }
}

/**
 * Upload un document de conformité vers Supabase Storage
 */
export async function uploadShopDocument(formData: FormData) {
  const shopId = formData.get('shopId') as string
  if (!shopId) return { error: 'shopId manquant.' }

  const auth = await requireShopOwner(shopId)
  if (auth.error) return { error: auth.error }

  // Rate Limiting
  const rateLimit = await checkRateLimit(auth.user!.id, 'upload')
  if (!rateLimit.allowed) {
    return { error: `Trop de tentatives d'envoi. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
  }


  try {
    const type = formData.get('type') as ShopDocumentType
    const file = formData.get('file') as File
    const expiresAtStr = formData.get('expiresAt') as string

    if (!file || file.size === 0) return { error: 'Fichier manquant.' }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { ownerId: true }
    })
    const vendorId = shop?.ownerId || 'unknown-vendor'

    // 1. Trouver si un document du même type existe déjà pour cette boutique
    const existingDoc = await prisma.shopDocument.findFirst({
      where: { shopId, type }
    })

    const adminSupabase = createAdminClient()

    // 2. Supprimer l'ancien fichier du Storage s'il existe
    if (existingDoc && existingDoc.fileUrl) {
      try {
        const urlParts = existingDoc.fileUrl.split('/documents/')
        if (urlParts.length > 1) {
          await adminSupabase.storage.from('documents').remove([urlParts[1]])
        }
        // Supprimer l'ancienne entrée en base
        await prisma.shopDocument.delete({ where: { id: existingDoc.id } })
      } catch (err) {
        console.error('Failed to clean up old document:', err)
      }
    }
    const fileExt = file.name.split('.').pop()
    const fileName = `${type.toLowerCase()}_${Date.now()}.${fileExt}`
    const filePath = `${vendorId}/${fileName}`

    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('documents')
    .upload(filePath, file)

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = adminSupabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    // Enregistrer le document en DB
    const doc = await prisma.shopDocument.create({
      data: {
        shopId,
        type,
        fileUrl: publicUrl,
        fileName: file.name,
        expiresAt: expiresAtStr ? new Date(expiresAtStr) : null,
        verificationStatus: 'PENDING'
      }
    })

    // Log the compliance event
    await prisma.shopComplianceEvent.create({
      data: {
        shopId,
        eventType: "DOCUMENT_UPLOADED",
        message: `Nouveau document de type ${type} mis en ligne.`
      }
    })

    // Mettre à jour le statut de vérification global de la boutique
    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: { verificationStatus: 'SUBMITTED' },
      include: {
        owner: true
      }
    })

    // --- ENVOI DE L'EMAIL DE CONFIRMATION ---
    if (updatedShop.owner.email) {
      try {
        await sendEmail({
          to: updatedShop.owner.email,
          subject: `Votre dossier boutique a bien été reçu - ${updatedShop.name}`,
          react: ComplianceDossierReceivedEmail({
            sellerName: `${updatedShop.owner.firstName || ''} ${updatedShop.owner.lastName || ''}`.trim() || 'Vendeur',
            shopName: updatedShop.name,
            verificationLink: `${APP_URL}/dashboard/compliance`
          })
        })
      } catch (emailError) {
        console.error('Error sending compliance confirmation email:', emailError)
      }
    }

    revalidatePath('/seller/dashboard/compliance')
    return { success: true, doc }
  } catch (error: any) {
    console.error('Error uploading shop document:', error)
    return { error: 'Échec de l\'envoi du document.' }
  }
}

/**
 * Soumettre la boutique pour une vérification complète par l'admin
 */
export async function submitShopForVerification(shopId: string) {
  const auth = await requireShopOwner(shopId)
  if (auth.error) return { error: auth.error }

  try {
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { 
        verificationStatus: 'SUBMITTED',
        status: 'UNDER_REVIEW'
      }
    })

    await prisma.shopComplianceEvent.create({
      data: {
        shopId,
        eventType: "SHOP_SUBMITTED_FOR_VERIFICATION",
        message: "La boutique a été soumise pour vérification complète."
      }
    })

    revalidatePath('/seller/dashboard/compliance')
    return { success: true, shop }
  } catch (error: any) {
    console.error('Error submitting shop for verification:', error)
    return { error: 'Échec de la soumission pour vérification.' }
  }
}
