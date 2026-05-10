'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { TransportType, BatchStatus, ContainerType, OrderStatus } from '@prisma/client'
import { requireRole } from '@/lib/auth-guard'

/**
 * Cascade un événement de tracking logistique de Lot (Batch) vers toutes les commandes enfants.
 */
export async function addBatchTrackingEvent(batchId: string, status: BatchStatus, description: string, locationStr: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const batch = await prisma.shipmentBatch.update({
      where: { id: batchId },
      data: { status },
      include: { orders: true }
    })

    if (batch.orders.length > 0) {
      // Injection de masse d'événements de tracking
      const eventsData = batch.orders.map(order => ({
        orderId: order.id,
        status: (status === 'SHIPPED' ? 'SHIPPED' : status === 'DELIVERED' ? 'DELIVERED' : 'IN_TRANSIT') as any,
        note: `[Lot ${batch.batchNumber}] ${description}`,
        location: locationStr,
        createdByUserId: auth.user!.id
      }))
      
      await prisma.orderTrackingEvent.createMany({
        data: eventsData
      })

      // Mise à jour magique des statuts de commande sans casser les litiges (ISSUE)
      let orderStatus: OrderStatus | null = null
      if (status === 'SHIPPED') orderStatus = 'SHIPPED'
      else if (status === 'DELIVERED') orderStatus = 'DELIVERED'

      if (orderStatus) {
        await prisma.order.updateMany({
          where: { shipmentBatchId: batchId, status: { not: 'ISSUE' } },
          data: { status: orderStatus }
        })
      }
    }

    revalidatePath(`/admin/logistics/consolidation/${batchId}`)
    return { success: true }
  } catch (error) {
    console.error('Batch Tracking Error:', error)
    return { error: 'Erreur lors du déploiement du tracking cascade.' }
  }
}

/**
 * Recalcule le poids et le volume CBM total du batch.
 * Suggère automatiquement un type de conteneur si le volume justifie un 20FT ou 40FT (Maritime uniquement).
 */
export async function recalculateBatchMetrics(batchId: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return

  const batch = await prisma.shipmentBatch.findUnique({
    where: { id: batchId },
    include: {
      orders: {
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  })

  if (!batch) return

  let totalWeight = 0
  let totalVolume = 0 // CBM

  for (const order of batch.orders) {
    for (const item of order.items) {
      const q = item.quantity
      const p = item.product
      
      const w = p.weight && p.weight > 0 ? p.weight : 0.5
      totalWeight += (w * q)

      const l = p.length && p.length > 0 ? p.length : 10
      const wd = p.width && p.width > 0 ? p.width : 10
      const h = p.height && p.height > 0 ? p.height : 10
      
      totalVolume += ((l * wd * h) / 1000000) * q
    }
  }

  // Arrondis de sécurité
  totalWeight = Math.round(totalWeight * 100) / 100
  totalVolume = Math.round(totalVolume * 1000) / 1000

  // Logique automatique d'assistance conteneur
  let newContainerType = batch.containerType
  if (batch.transportMode === 'SEA' && !batch.containerType) {
    if (totalVolume >= 58) newContainerType = 'FT40'
    else if (totalVolume >= 28) newContainerType = 'FT20'
  }

  await prisma.shipmentBatch.update({
    where: { id: batchId },
    data: {
      totalWeight,
      totalVolume,
      containerType: newContainerType
    }
  })
}

export async function createBatch(data: {
  originCountry: string
  destinationCountry: string
  transportMode: TransportType
  cargoId?: string
}) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const profile = await prisma.profile.findUnique({ where: { id: auth.user!.id } })
    if (profile?.role !== 'ADMIN') return { error: 'Accès refusé' }

    const batchNumber = `LGT-${Date.now()}`

    const batch = await prisma.shipmentBatch.create({
      data: {
        batchNumber,
        originCountry: data.originCountry,
        destinationCountry: data.destinationCountry,
        transportMode: data.transportMode,
        cargoId: data.cargoId || null,
        status: 'OPEN'
      }
    })

    revalidatePath('/admin/logistics/consolidation')
    return { success: true, batchId: batch.id }
  } catch (error) {
    console.error('Create Batch Error:', error)
    return { error: 'Une erreur est survenue lors de la création du lot.' }
  }
}

export async function assignOrderToBatch(batchId: string, orderId: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    // Vérifier compatibilité (Pays & Mode)
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    const batch = await prisma.shipmentBatch.findUnique({ where: { id: batchId } })

    if (!order || !batch) return { error: 'Entités introuvables.' }
    if (order.destinationCountry !== batch.destinationCountry) {
      return { error: 'Le pays de destination de la commande ne correspond pas au lot.' }
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { shipmentBatchId: batchId }
    })

    // Recalculer le CBM et Poids du lot (Phase 3 & 4)
    await recalculateBatchMetrics(batchId)

    revalidatePath(`/admin/logistics/consolidation/${batchId}`)
    return { success: true }
  } catch (error) {
    console.error('Assign Order Error:', error)
    return { error: 'Erreur lors de l\'assignation de la commande.' }
  }
}

export async function removeOrderFromBatch(batchId: string, orderId: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { shipmentBatchId: null }
    })

    // Recalculer le CBM et Poids du lot après retrait (Phase 3 & 4)
    await recalculateBatchMetrics(batchId)

    revalidatePath(`/admin/logistics/consolidation/${batchId}`)
    return { success: true }
  } catch (error) {
    return { error: 'Erreur lors du retrait de la commande.' }
  }
}

export async function updateBatchContainerType(batchId: string, containerType: ContainerType | null) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    await prisma.shipmentBatch.update({
      where: { id: batchId },
      data: { containerType }
    })
    
    revalidatePath(`/admin/logistics/consolidation/${batchId}`)
    return { success: true }
  } catch (error) {
    return { error: 'Erreur technique' }
  }
}
