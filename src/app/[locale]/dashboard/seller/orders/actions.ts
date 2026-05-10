'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { LogisticsStatus, Role } from '@prisma/client'
import { recordStatusChange, isTransitionAllowed } from '@/lib/order-status'
import { revalidatePath } from 'next/cache'

export async function updateOrderLogisticsStatus(orderId: string, nextStatus: LogisticsStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Fetch profile to verify role
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  })

  if (!profile || profile.role !== 'VENDOR' && profile.role !== 'ADMIN') {
    return { error: 'Seuls les vendeurs peuvent effectuer cette action' }
  }

  // Fetch current order status
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, logisticsStatus: true }
  })

  if (!order) {
    return { error: 'Commande introuvable' }
  }

  // Validate transition
  if (!isTransitionAllowed(profile.role, order.logisticsStatus, nextStatus)) {
    return { error: `Transition de ${order.logisticsStatus} vers ${nextStatus} non autorisée` }
  }

  try {
    await recordStatusChange({
      orderId: order.id,
      previousStatus: order.logisticsStatus,
      newStatus: nextStatus,
      changedById: user.id,
      changedByRole: profile.role,
      note: `Action vendeur: Passage à ${nextStatus}`
    })

    revalidatePath('/dashboard/seller/orders')
    revalidatePath(`/dashboard/seller/orders/${orderId}`)

    return { success: true }
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
    return { error: 'Une erreur est survenue lors de la mise à jour du statut' }
  }
}
