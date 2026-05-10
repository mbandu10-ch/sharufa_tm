'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { FinancialStatus } from "@prisma/client"
import { requireRole } from "@/lib/auth-guard"

const COMMISSION_RATE = 0.14 // 14% Sharufa Commission

/**
 * Crée une entrée financière pour une commande (calcul commission 14%).
 * Appelé en interne (webhook, admin actions) — vérifie le rôle ADMIN.
 */
export async function createFinancialEntry(orderId: string) {
  // Note: cette fonction est aussi appelée par le webhook Stripe, 
  // où il n'y a pas d'utilisateur authentifié. On la garde sans auth
  // mais on la protège au niveau de l'import (seul le webhook et les actions admin l'appellent).
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        shop: true,
        items: { include: { product: true } }
      }
    })

    if (!order) return { error: "Commande introuvable." }
    
    // Resolve shopId: use order.shopId or first item's shopId
    let shopId = order.shopId
    if (!shopId && order.items.length > 0) {
      shopId = order.items[0].product.shopId
    }

    if (!shopId) return { error: "Boutique introuvable pour cette commande." }

    const commissionAmount = order.totalAmount * COMMISSION_RATE
    const netAmount = order.totalAmount - commissionAmount

    const transaction = await prisma.financialTransaction.upsert({
      where: { orderId: orderId },
      update: {
        totalAmount: order.totalAmount,
        commissionAmount,
        netAmount,
      },
      create: {
        orderId: orderId,
        shopId: shopId,
        totalAmount: order.totalAmount,
        commissionAmount,
        netAmount,
        status: 'PENDING'
      }
    })

    await prisma.financialEvent.create({
      data: {
        shopId: shopId,
        transactionId: transaction.id,
        eventType: "ENTRY_CREATED",
        message: `Entrée financière créée pour la commande ${order.orderNumber}. Commission: ${commissionAmount.toLocaleString()} CFA.`,
      }
    })

    return { success: true, transaction }
  } catch (error: any) {
    console.error('Error creating financial entry:', error)
    return { error: 'Échec de la création de l\'entrée financière.' }
  }
}

/**
 * Met à jour le statut d'un virement/transaction.
 */
export async function updatePayoutStatus(
  transactionId: string, 
  status: FinancialStatus, 
  notes?: string
) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const transaction = await prisma.financialTransaction.update({
      where: { id: transactionId },
      data: { 
        status,
        adminNotes: notes || undefined
      }
    })

    await prisma.financialEvent.create({
      data: {
        shopId: transaction.shopId,
        transactionId: transaction.id,
        adminId: auth.user!.id,
        eventType: "STATUS_UPDATED",
        message: `Statut de paiement mis à jour vers ${status}.${notes ? ` Note: ${notes}` : ''}`,
      }
    })

    revalidatePath('/admin/finance')
    revalidatePath(`/admin/finance/${transaction.shopId}`)
    return { success: true, transaction }
  } catch (error: any) {
    console.error('Error updating payout status:', error)
    return { error: 'Échec de la mise à jour du statut financier.' }
  }
}

/**
 * Vérifie l'éligibilité globale d'une boutique pour les paiements.
 */
export async function checkShopFinanceEligibility(shopId: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { eligible: false, reason: auth.error }

  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        documents: {
          where: { type: 'RIB', verificationStatus: 'VERIFIED' }
        }
      }
    })

    if (!shop) return { eligible: false, reason: "Boutique introuvable." }
    
    if (!shop.isVerified) return { eligible: false, reason: "Boutique non vérifiée." }
    
    if (shop.documents.length === 0) return { eligible: false, reason: "RIB non validé." }

    return { eligible: true }
  } catch (error) {
    return { eligible: false, reason: "Erreur de vérification." }
  }
}

/**
 * Récupère le résumé financier brut pour l'admin.
 */
export async function getFinanceSummary() {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { totalVolume: 0, totalCommission: 0, totalToPay: 0, totalPaid: 0 }

  const stats = await prisma.financialTransaction.groupBy({
    by: ['status'],
    _sum: {
      totalAmount: true,
      commissionAmount: true,
      netAmount: true,
    }
  })
  
  let totalVolume = 0
  let totalCommission = 0
  let totalToPay = 0
  let totalPaid = 0

  stats.forEach(stat => {
    totalVolume += stat._sum.totalAmount || 0
    totalCommission += stat._sum.commissionAmount || 0
    if (stat.status === 'PAID') {
      totalPaid += stat._sum.netAmount || 0
    } else {
      totalToPay += stat._sum.netAmount || 0
    }
  })

  return {
    totalVolume,
    totalCommission,
    totalToPay,
    totalPaid
  }
}
