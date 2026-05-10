'use server'

import { prisma } from "@sharufa/db"
import { revalidatePath } from "next/cache"
import { ShopDocumentStatus, ShopVerificationStatus, ShopStatus, ShopDocumentType } from "@prisma/client"
import { uploadFile } from "@root/lib/supabase/storage"
import { sendEmail } from "@root/lib/resend"
import { DocumentRejectedEmail } from "@components/emails/DocumentRejectedEmail"
import { ShopVerifiedApprovedEmail } from "@components/emails/ShopVerifiedApprovedEmail"
import { BankInfoApprovedEmail } from "@components/emails/BankInfoApprovedEmail"
import { requireRole } from "@root/lib/auth-guard"

const APP_URL = process.env.NEXT_PUBLIC_SELLER_PORTAL_URL || 'https://seller.sharufa.com'

/**
 * Valide ou rejette un document spécifique.
 */
export async function verifyDocument(docId: string, status: ShopDocumentStatus, rejectionReason?: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const doc = await prisma.shopDocument.update({
      where: { id: docId },
      data: { 
        verificationStatus: status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        verifiedAt: new Date(),
        // verifiedBy should be set by the authenticated admin ID (simplified for now)
      }
    })

    await prisma.shopComplianceEvent.create({
      data: {
        shopId: doc.shopId,
        eventType: "DOCUMENT_VERIFIED",
        message: `Le document ${doc.type} a été marqué comme ${status}.${rejectionReason ? ` Raison: ${rejectionReason}` : ''}`
      }
    })

    // --- ENVOI DES EMAILS DE NOTIFICATION ---
    const shop = await prisma.shop.findUnique({
      where: { id: doc.shopId },
      include: { owner: true }
    })

    if (shop) {
      if (status === 'REJECTED' && shop.owner.email) {
        await sendEmail({
          to: shop.owner.email,
          subject: `Un document de votre boutique doit être corrigé - ${shop.name}`,
          react: DocumentRejectedEmail({
            sellerName: `${shop.owner.firstName || ''} ${shop.owner.lastName || ''}`.trim() || 'Vendeur',
            shopName: shop.name,
            documentType: doc.type,
            rejectionReason: rejectionReason || 'Information non conforme',
            verificationLink: `${APP_URL}/dashboard/compliance`
          })
        })
      } else if (status === 'VERIFIED' && doc.type === 'RIB' && shop.owner.email) {
        await sendEmail({
          to: shop.owner.email,
          subject: `Vos coordonnées bancaires ont été validées - ${shop.name}`,
          react: BankInfoApprovedEmail({
            sellerName: `${shop.owner.firstName || ''} ${shop.owner.lastName || ''}`.trim() || 'Vendeur',
            shopName: shop.name,
            dashboardLink: `${APP_URL}/dashboard`
          })
        })
      }
    }

    revalidatePath('/dashboard/compliance')
    return { success: true, doc }
  } catch (error: any) {
    console.error('Error verifying document:', error)
    return { error: 'Échec de la vérification du document.' }
  }
}

/**
 * Approuve ou rejette globalement une boutique et accorde le badge Verified.
 */
export async function updateShopVerification(shopId: string, isVerified: boolean, status: ShopVerificationStatus) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { 
        isVerified,
        verificationStatus: status,
        verifiedAt: isVerified ? new Date() : null,
        status: status === 'VERIFIED' ? 'APPROVED' : 'UNDER_REVIEW'
      }
    })

    await prisma.shopComplianceEvent.create({
      data: {
        shopId,
        eventType: "SHOP_VERIFICATION_UPDATED",
        message: `Statut de vérification mis à jour: ${status}. Badge Verified: ${isVerified}`
      }
    })

    // --- ENVOI DE L'EMAIL DE VALIDATION FINALE ---
    try {
      const fullShop = await prisma.shop.findUnique({
        where: { id: shopId },
        include: { owner: true }
      })

      if (fullShop?.owner?.email && status === 'VERIFIED') {
        await sendEmail({
          to: fullShop.owner.email,
          subject: `Votre boutique est vérifiée et approuvée sur Sharufa - ${fullShop.name}`,
          react: ShopVerifiedApprovedEmail({
            sellerName: `${fullShop.owner.firstName || ''} ${fullShop.owner.lastName || ''}`.trim() || 'Vendeur',
            shopName: fullShop.name,
            dashboardLink: `${APP_URL}/dashboard`
          })
        })
      }
    } catch (emailError) {
      console.error('Error sending final verification email:', emailError)
    }

    revalidatePath('/dashboard/compliance')
    return { success: true, shop }
  } catch (error: any) {
    console.error('Error updating shop verification:', error)
    return { error: 'Échec de la mise à jour de la vérification.' }
  }
}

/**
 * Met à jour les notes internes administratives d'une boutique.
 */
export async function updateInternalNotes(shopId: string, notes: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const profile = await prisma.shopLegalProfile.update({
      where: { shopId },
      data: { notes }
    })

    await prisma.shopComplianceEvent.create({
      data: {
        shopId,
        eventType: "INTERNAL_NOTE_ADDED",
        message: "Une note administrative interne a été mise à jour."
      }
    })

    revalidatePath(`/admin/compliance/${shopId}`)
    return { success: true, profile }
  } catch (error: any) {
    console.error('Error updating internal notes:', error)
    return { error: 'Échec de la mise à jour des notes.' }
  }
}

/**
 * Met à jour le statut global d'une boutique (Suspendre, Archiver, Activer).
 */
export async function updateShopStatus(shopId: string, status: ShopStatus) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    // Si on archive ou suspend, on masque la boutique
    const isVisible = status === 'APPROVED'
    
    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { 
        status,
        isVisible
      }
    })

    await prisma.shopComplianceEvent.create({
      data: {
        shopId,
        eventType: "SHOP_STATUS_UPDATED",
        message: `La boutique a été passée au statut ${status}. Visibilité publique: ${isVisible}`
      }
    })

    revalidatePath(`/admin/compliance/${shopId}`)
    revalidatePath('/admin/shops')
    revalidatePath('/marketplace')
    
    return { success: true, shop }
  } catch (error: any) {
    console.error('Error updating shop status:', error)
    return { error: 'Échec de la mise à jour du statut.' }
  }
}

/**
 * Supprime définitivement une boutique après vérification des contraintes métiers.
 */
export async function deleteShopPermanently(shopId: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    // 1. Vérifier les commandes
    const ordersCount = await prisma.order.count({
      where: { shopId }
    })

    if (ordersCount > 0) {
      return { 
        error: "Suppression impossible : cette boutique possède des commandes. Veuillez l'archiver à la place.",
        code: 'HAS_ORDERS'
      }
    }

    // 2. Vérifier les transactions financières
    const financeCount = await prisma.financialTransaction.count({
      where: { shopId }
    })

    if (financeCount > 0) {
      return { 
        error: "Suppression impossible : cette boutique possède un historique financier. Veuillez l'archiver à la place.",
        code: 'HAS_FINANCE'
      }
    }

    // 3. Suppression physique (Les produits ne cascadent pas automatiquement)
    await prisma.product.deleteMany({
      where: { shopId }
    })

    await prisma.shop.delete({
      where: { id: shopId }
    })

    revalidatePath('/admin/shops')
    revalidatePath('/marketplace')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting shop:', error)
    return { error: 'Échec de la suppression de la boutique.' }
  }
}

/**
 * Permet à un administrateur d'uploader un document pour une boutique.
 */
export async function adminUploadDocument(formData: FormData) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const shopId = formData.get('shopId') as string
    const type = formData.get('type') as ShopDocumentType
    const file = formData.get('file') as File

    if (!shopId || !type || !file) {
      return { error: 'Données manquantes (shopId, type ou fichier).' }
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { ownerId: true }
    })
    const vendorId = shop?.ownerId || 'unknown-vendor'

    // Upload vers Supabase Storage
    const { publicUrl } = await uploadFile(file, 'documents', `${vendorId}`)

    // Enregistrement dans la base de données
    const doc = await prisma.shopDocument.create({
      data: {
        shopId,
        type,
        fileName: file.name,
        fileUrl: publicUrl,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
      }
    })

    await prisma.shopComplianceEvent.create({
      data: {
        shopId,
        eventType: "DOCUMENT_UPLOADED_BY_ADMIN",
        message: `L'administrateur a ajouté manuellement le document : ${type}`
      }
    })

    revalidatePath(`/admin/compliance/${shopId}`)
    return { success: true, doc }
  } catch (error: any) {
    console.error('Error admin uploading document:', error)
    return { error: "Échec de l'upload du document par l'administrateur." }
  }
}
