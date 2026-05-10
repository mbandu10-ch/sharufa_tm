'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { uploadMultipleFiles } from "@/lib/supabase/storage"
import { recordStatusChange, isTransitionAllowed } from "@/lib/order-status"
import { LogisticsStatus, Role, TrackingStatus, OrderStatus, QualityCheckStatus } from "@prisma/client"
import { checkRateLimit } from "@/lib/rate-limit"


/**
 * Ajoute un événement de tracking logistique et met à jour le statut global si nécessaire.
 */
export async function addTrackingEvent(data: {
  orderId: string
  status: TrackingStatus
  location?: string
  note?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non autorisé." }
  }

  // Rate Limiting
  const rateLimit = await checkRateLimit(user.id, 'admin')
  if (!rateLimit.allowed) {
    return { error: `Trop de requêtes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 1000)} secondes.` }
  }


  try {
    // Check if user is CARGO (or ADMIN)
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true, cargoId: true }
    })

    if (profile?.role !== 'CARGO' && profile?.role !== 'ADMIN') {
      return { error: "Vous n'avez pas les permissions pour gérer le tracking." }
    }

    // Si on veut expédier, on vérifie d'abord le contrôle qualité
    if (data.status === 'SHIPPED') {
      const order = await prisma.order.findUnique({
        where: { id: data.orderId },
        include: { qualityCheck: true }
      })
      
      if (!order) return { error: "Commande introuvable." }
      
      let requiresQc = false
      if (order.originCountry) {
        const country = await prisma.country.findFirst({
          where: {
             OR: [
              { name: { equals: order.originCountry, mode: 'insensitive' } },
              { code: { equals: order.originCountry, mode: 'insensitive' } }
             ]
          }
        })
        requiresQc = country?.qualityCheckRequired ?? false
      }

      if (requiresQc) {
        if (!order.qualityCheck || order.qualityCheck.status !== 'APPROVED') {
          return { error: "La conformité (Contrôle Qualité) doit être approuvée avant l'expédition." }
        }
      }
    }

    // Add tracking event
    const event = await prisma.orderTrackingEvent.create({
      data: {
        orderId: data.orderId,
        status: data.status,
        location: data.location,
        note: data.note,
        createdByUserId: user.id
      }
    })

    // Update global Order status based on tracking status if needed
    let globalStatus: OrderStatus | null = null
    
    if (data.status === 'SHIPPED') globalStatus = 'SHIPPED'
    if (data.status === 'DELIVERED') globalStatus = 'DELIVERED'
    if (data.status === 'RECEIVED_AT_WAREHOUSE') globalStatus = 'PROCESSING'

    if (globalStatus) {
      await prisma.order.update({
        where: { id: data.orderId },
        data: { status: globalStatus }
      })
    }

    // Revalidate paths
    revalidatePath(`/cargo/orders/${data.orderId}`)
    revalidatePath(`/dashboard/orders/${data.orderId}`)
    revalidatePath(`/admin/orders/${data.orderId}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('Add Tracking Event Error:', error)
    return { error: "Une erreur est survenue lors de l'ajout de l'événement." }
  }
}

/**
 * Enregistre ou met à jour le contrôle qualité d'une commande (Cargo / Admin)
 */
export async function submitQualityCheck(data: {
  orderId: string
  status: QualityCheckStatus
  notes?: string
  mediaUrls: { url: string, type: string }[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non autorisé." }

  // Rate Limiting
  const rateLimit = await checkRateLimit(user.id, 'admin')
  if (!rateLimit.allowed) {
    return { error: `Trop de requêtes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 1000)} secondes.` }
  }


  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true, cargoId: true }
    })

    if (profile?.role !== 'CARGO' && profile?.role !== 'ADMIN') {
      return { error: "Vous n'avez pas les permissions." }
    }
    
    const order = await prisma.order.findUnique({ where: { id: data.orderId } })
    if (!order) return { error: "Commande introuvable." }
    
    const targetCargoId = profile.cargoId || order.cargoId
    if (!targetCargoId) {
      return { error: "Aucun Cargo assigné pour effectuer le contrôle." }
    }

    await prisma.orderQualityCheck.upsert({
      where: { orderId: data.orderId },
      update: {
        status: data.status,
        notes: data.notes,
        cargoId: targetCargoId,
        media: {
           deleteMany: {}, 
           create: data.mediaUrls.map(m => ({ fileUrl: m.url, type: m.type }))
        }
      },
      create: {
        orderId: data.orderId,
        status: data.status,
        notes: data.notes,
        cargoId: targetCargoId,
        media: {
           create: data.mediaUrls.map(m => ({ fileUrl: m.url, type: m.type }))
        }
      }
    })

    // Logique stipulée : QUALITY_CHECK_FAILED -> ORDER_STATUS = ISSUE
    if (data.status === 'FAILED') {
      await prisma.order.update({
        where: { id: data.orderId },
        data: { status: 'ISSUE' }
      })
      await prisma.orderEvent.create({
        data: {
          orderId: data.orderId,
          eventType: 'ISSUE_REPORTED',
          message: 'Le contrôle qualité avant expédition a échoué.',
        }
      })
    } else if (data.status === 'APPROVED' && order.status === 'ISSUE') {
      // Revert if later approved (optional safety)
      await prisma.order.update({
        where: { id: data.orderId },
        data: { status: 'PROCESSING' }
      })
    }

    revalidatePath(`/cargo/orders/${data.orderId}`)
    revalidatePath(`/dashboard/orders/${data.orderId}`)
    revalidatePath(`/admin/orders/${data.orderId}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('Submit QC Error:', error)
    return { error: "Erreur lors de l'enregistrement du contrôle qualité." }
  }
}

/**
 * Uploade les fichiers de QC vers Supabase et retourne les URLs
 */
export async function uploadQualityCheckMediaFiles(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non autorisé." }

  // Rate Limiting
  const rateLimit = await checkRateLimit(user.id, 'upload')
  if (!rateLimit.allowed) {
    return { error: `Trop de tentatives d'envoi. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
  }


  const files = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('media[') && value instanceof File) {
      files.push(value)
    }
  }

  if (files.length === 0) return { urls: [] }

  try {
    const results = await uploadMultipleFiles(files, 'cargo', `qc/${user.id}`)
    const urls = results.map(r => ({
      url: r.publicUrl,
      type: r.path.match(/\.(mp4|mov|avi)$/i) ? 'VIDEO' : 'IMAGE'
    }))
    return { urls }
  } catch (error: any) {
    console.error("QC Upload error:", error)
    return { error: "Erreur lors du téléchargement des fichiers." }
  }
}

/**
 * Uploade les preuves logistiques vers le bucket 'logistics'
 */
export async function uploadLogisticsProof(formData: FormData, orderId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Non autorisé." }

  // Rate Limiting
  const rateLimit = await checkRateLimit(user.id, 'upload')
  if (!rateLimit.allowed) {
    return { error: `Trop de tentatives d'envoi. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
  }


  const files = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('files[') && value instanceof File) {
      files.push(value)
    }
  }

  if (files.length === 0) return { urls: [] }

  try {
    // Structure: logistics/order-id/status/filename
    const folder = `${orderId}/${status.toLowerCase()}`
    const results = await uploadMultipleFiles(files, 'logistics', folder)
    const urls = results.map(r => r.publicUrl)
    return { urls }
  } catch (error: any) {
    console.error("Logistics Proof Upload error:", error)
    return { error: "Erreur lors du téléchargement des preuves." }
  }
}


/**
 * Gère une transition opérationnelle contrôlée pour un partenaire Cargo.
 * Enregistre l'audit trail et met à jour les statuts de manière atomique.
 */
export async function processOperationalTransition(data: {
  orderId: string
  action: 'RECEIVE' | 'SHIP' | 'MARK_TRANSIT' | 'MARK_READY' | 'DELIVER' | 'REPORT_ISSUE'
  location: string
  note?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non autorisé." }

  // Rate Limiting
  const rateLimit = await checkRateLimit(user.id, 'admin')
  if (!rateLimit.allowed) {
    return { error: `Trop de requêtes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 1000)} secondes.` }
  }


  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true, cargoId: true }
    })

    if (profile?.role !== 'CARGO' && profile?.role !== 'ADMIN') {
      return { error: "Permissions insuffisantes." }
    }

    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        trackingEvents: { orderBy: { createdAt: 'desc' }, take: 1 },
        qualityCheck: true
      }
    })

    if (!order) return { error: "Commande introuvable." }
    if (profile.role === 'CARGO' && order.cargoId !== profile.cargoId) {
      return { error: "Vous n'êtes pas assigné à cette commande." }
    }

    let nextTrackingStatus: TrackingStatus | null = null
    let nextOrderStatus: OrderStatus | null = null
    const lastTrackingStatus = order.trackingEvents[0]?.status

    // State Machine logic
    switch (data.action) {
      case 'RECEIVE':
        if (lastTrackingStatus) return { error: "Le colis est déjà marqué comme reçu." }
        nextTrackingStatus = 'RECEIVED_AT_WAREHOUSE'
        nextOrderStatus = 'PROCESSING'
        break

      case 'SHIP':
        if (lastTrackingStatus !== 'RECEIVED_AT_WAREHOUSE' && lastTrackingStatus !== 'IN_CONSOLIDATION') {
          return { error: "L'expédition nécessite que le colis soit reçu à l'entrepôt." }
        }
        
        // Check QC if required
        const country = await prisma.country.findFirst({
          where: {
             OR: [
              { name: { equals: order.originCountry || '', mode: 'insensitive' } },
              { code: { equals: order.originCountry || '', mode: 'insensitive' } }
             ]
          }
        })
        if (country?.qualityCheckRequired && (!order.qualityCheck || order.qualityCheck.status !== 'APPROVED')) {
          return { error: "Le contrôle qualité doit être approuvé avant l'expédition." }
        }

        nextTrackingStatus = 'SHIPPED'
        nextOrderStatus = 'SHIPPED'
        break

      case 'MARK_TRANSIT':
        if (lastTrackingStatus !== 'SHIPPED') {
          return { error: "Le colis doit être expédié avant d'être marqué en transit." }
        }
        nextTrackingStatus = 'IN_TRANSIT'
        break

      case 'MARK_READY':
        if (lastTrackingStatus !== 'IN_TRANSIT' && lastTrackingStatus !== 'ARRIVED_DESTINATION') {
          return { error: "Le colis doit être en transit pour être prêt à la livraison." }
        }
        nextTrackingStatus = 'OUT_FOR_DELIVERY'
        break

      case 'DELIVER':
        if (lastTrackingStatus !== 'OUT_FOR_DELIVERY') {
          return { error: "Le colis doit être en cours de livraison avant d'être marqué comme livré." }
        }
        nextTrackingStatus = 'DELIVERED'
        nextOrderStatus = 'DELIVERED'
        break

      case 'REPORT_ISSUE':
        nextOrderStatus = 'ISSUE'
        break
    }

    if (!nextTrackingStatus && !nextOrderStatus && data.action !== 'REPORT_ISSUE') {
      return { error: "Action non valide dans l'état actuel." }
    }

    // Atomic update
    await prisma.$transaction(async (tx) => {
      if (nextTrackingStatus) {
        await tx.orderTrackingEvent.create({
          data: {
            orderId: data.orderId,
            status: nextTrackingStatus,
            location: data.location,
            note: data.note,
            createdByUserId: user.id
          }
        })
      }

      if (nextOrderStatus) {
        await tx.order.update({
          where: { id: data.orderId },
          data: { status: nextOrderStatus }
        })
      }

      // If issue, also log a global order event
      if (data.action === 'REPORT_ISSUE') {
        await tx.orderEvent.create({
          data: {
            orderId: data.orderId,
            eventType: 'LOGISTICS_ISSUE',
            message: data.note || "Un problème logistique a été signalé par l'opérateur cargo."
          }
        })
      }
    })

    revalidatePath(`/cargo/orders/${data.orderId}`)
    revalidatePath(`/dashboard/orders/${data.orderId}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('Operational Transition Error:', error)
    return { error: "Échec de la transition : " + error.message }
  }
}

/**
 * Nouvelle version contrôlée de la transition logistique utilisant le LogisticsStatus.
 */
export async function updateOrderLogisticsStatusByCargo(data: {
  orderId: string
  nextStatus: LogisticsStatus
  location: string
  note?: string
  mediaUrls?: string[]
  batchId?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non autorisé." }

  // Rate Limiting
  const rateLimit = await checkRateLimit(user.id, 'admin')
  if (!rateLimit.allowed) {
    return { error: `Trop de requêtes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 1000)} secondes.` }
  }


  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true, cargoId: true, cargo: true }
    })

    if (profile?.role !== 'CARGO' && profile?.role !== 'ADMIN') {
      return { error: "Permissions insuffisantes." }
    }

    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      select: { id: true, logisticsStatus: true, cargoId: true }
    })

    if (!order) return { error: "Commande introuvable." }
    if (profile.role === 'CARGO' && order.cargoId !== profile.cargoId) {
      return { error: "Vous n'êtes pas assigné à cette commande." }
    }

    // Validation de la transition via le helper partagé
    if (!isTransitionAllowed(profile.role as Role, order.logisticsStatus, data.nextStatus)) {
      return { error: `Transition de ${order.logisticsStatus} vers ${data.nextStatus} non autorisée.` }
    }

    // 1. Validation des PREUVES OBLIGATOIRES
    const requiresProof = ['RECEIVED_BY_CARGO', 'REJECTED_BY_CARGO', 'SHIPPED', 'DELIVERED'].includes(data.nextStatus)
    
    if (requiresProof) {
      if (!data.mediaUrls || data.mediaUrls.length === 0) {
        return { error: `Des photos de preuve sont obligatoires pour passer au statut ${data.nextStatus}.` }
      }
      if (!data.note) {
        return { error: `Une note explicative est obligatoire pour ce statut.` }
      }
    }

    // 2. Validation Spécifique Maritime
    if (data.nextStatus === 'SHIPPED' && profile.cargo?.transportType === 'SEA' && !data.batchId) {
      return { error: "Pour le fret maritime, vous devez associer cette commande à un lot (Batch/Conteneur) lors de l'expédition." }
    }

    // Application de la transition et enregistrement de l'historique
    await recordStatusChange({
      orderId: order.id,
      previousStatus: order.logisticsStatus,
      newStatus: data.nextStatus,
      changedById: user.id,
      changedByRole: profile.role as Role,
      note: `${data.location ? `[${data.location}] ` : ''}${data.note}`,
      mediaUrls: data.mediaUrls,
      batchId: data.batchId
    })

    // Update global status for specific transitions
    if (data.nextStatus === 'SHIPPED') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'SHIPPED' }})
    } else if (data.nextStatus === 'DELIVERED') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'DELIVERED' }})
    }

    revalidatePath(`/cargo/orders/${data.orderId}`)
    revalidatePath(`/dashboard/orders/${data.orderId}`)
    revalidatePath(`/admin/orders/${data.orderId}`)
    revalidatePath(`/cargo`)
    
    return { success: true }
  } catch (error: any) {
    console.error('Cargo Transition Error:', error)
    return { error: "Échec de la transition : " + error.message }
  }
}

