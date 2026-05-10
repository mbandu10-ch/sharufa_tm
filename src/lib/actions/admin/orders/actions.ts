'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { OrderStatus, PaymentStatus } from "@prisma/client"
import { createFinancialEntry } from "../finance/actions"
import { requireRole } from "@/lib/auth-guard"
import { checkRateLimit } from "@/lib/rate-limit"


/**
 * Met à jour le statut d'une commande avec traçabilité complète.
 */
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  message?: string
) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  // Rate Limiting
  const rateLimit = await checkRateLimit(auth.user!.id, 'admin')
  if (!rateLimit.allowed) {
    return { error: `Trop de requêtes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 1000)} secondes.` }
  }


  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    // Log de l'événement d'audit
    await prisma.orderEvent.create({
      data: {
        orderId,
        adminId: auth.user!.id,
        eventType: "STATUS_UPDATED",
        message: `Statut de la commande mis à jour vers ${status}.${message ? ` Note: ${message}` : ''}`,
      }
    })

    // --- DÉCLENCHEMENT FINANCIER & LOGISTIQUE ---
    if (status === 'CONFIRMED' || status === 'PROCESSING') {
      await createFinancialEntry(orderId)

      // AUTO-ASSIGN CARGO
      const updatedOrder = await prisma.order.findUnique({
        where: { id: orderId },
        select: { originCountry: true, destinationCountry: true, cargoId: true }
      })

      if (updatedOrder && !updatedOrder.cargoId && updatedOrder.originCountry && updatedOrder.destinationCountry) {
        const matchingCargo = await prisma.cargo.findFirst({
          where: {
            originCountry: { equals: updatedOrder.originCountry, mode: 'insensitive' },
            destinationCountry: { equals: updatedOrder.destinationCountry, mode: 'insensitive' },
            isActive: true
          }
        })

        if (matchingCargo) {
          await prisma.order.update({
            where: { id: orderId },
            data: { cargoId: matchingCargo.id }
          })

          await prisma.orderEvent.create({
            data: {
              orderId,
              adminId: auth.user!.id,
              eventType: "CARGO_ASSIGNED",
              message: `Commande automatiquement assignée au Cargo : ${matchingCargo.name} (Route: ${updatedOrder.originCountry} -> ${updatedOrder.destinationCountry})`,
            }
          })
        }
      }
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true, order }
  } catch (error: any) {
    console.error('Error updating order status:', error)
    return { error: 'Échec de la mise à jour du statut de la commande.' }
  }
}

/**
 * Met à jour le statut de paiement d'une commande.
 */
export async function updatePaymentStatus(
  orderId: string, 
  status: PaymentStatus
) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  // Rate Limiting
  const rateLimit = await checkRateLimit(auth.user!.id, 'admin')
  if (!rateLimit.allowed) {
    return { error: `Trop de requêtes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 1000)} secondes.` }
  }


  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status }
    })

    await prisma.orderEvent.create({
      data: {
        orderId,
        adminId: auth.user!.id,
        eventType: "PAYMENT_STATUS_UPDATED",
        message: `Statut de paiement mis à jour vers ${status}.`,
      }
    })

    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true, order }
  } catch (error: any) {
    console.error('Error updating payment status:', error)
    return { error: 'Échec de la mise à jour du statut de paiement.' }
  }
}

/**
 * Ajoute une note interne à une commande.
 */
export async function addOrderInternalNote(orderId: string, note: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  // Rate Limiting
  const rateLimit = await checkRateLimit(auth.user!.id, 'admin')
  if (!rateLimit.allowed) {
    return { error: `Trop de requêtes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 1000)} secondes.` }
  }


  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { adminNotes: note }
    })

    await prisma.orderEvent.create({
      data: {
        orderId,
        adminId: auth.user!.id,
        eventType: "INTERNAL_NOTE_ADDED",
        message: "Une note administrative interne a été ajoutée/modifiée.",
      }
    })

    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error adding internal note:', error)
    return { error: 'Échec de l\'ajout de la note interne.' }
  }
}

/**
 * Signale un problème sur une commande.
 */
export async function reportOrderIssue(orderId: string, issueComment: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  // Rate Limiting
  const rateLimit = await checkRateLimit(auth.user!.id, 'admin')
  if (!rateLimit.allowed) {
    return { error: `Trop de requêtes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 1000)} secondes.` }
  }


  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'ISSUE' }
    })

    await prisma.orderEvent.create({
      data: {
        orderId,
        adminId: auth.user!.id,
        eventType: "ISSUE_REPORTED",
        message: `PROBLÈME SIGNALÉ : ${issueComment}`,
      }
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error reporting order issue:', error)
    return { error: 'Échec du signalement de problème.' }
  }
}
