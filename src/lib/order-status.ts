import { prisma } from '@/lib/prisma'
import { LogisticsStatus, Role } from '@prisma/client'
import { 
  ALLOWED_TRANSITIONS, 
  BUYER_STATUS_LABELS, 
  getBuyerStatusLabel, 
  isTransitionAllowed 
} from './order-status-config'

export { 
  ALLOWED_TRANSITIONS, 
  BUYER_STATUS_LABELS, 
  getBuyerStatusLabel, 
  isTransitionAllowed 
}

/**
 * Shared helper to record a logistics status change for an order.
 * Updates the Order.logisticsStatus and creates a record in OrderStatusHistory.
 */
export async function recordStatusChange({
  orderId,
  previousStatus,
  newStatus,
  changedById,
  changedByRole,
  note,
  mediaUrls,
  batchId
}: {
  orderId: string
  previousStatus: LogisticsStatus
  newStatus: LogisticsStatus
  changedById: string
  changedByRole: Role
  note?: string
  mediaUrls?: string[]
  batchId?: string
}) {
  return await prisma.$transaction(async (tx) => {
    // 1. Update the order logistics status
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { 
        logisticsStatus: newStatus,
        ...(batchId ? { shipmentBatchId: batchId } : {})
      }
    })

    // 2. Create the history record
    await tx.orderStatusHistory.create({
      data: {
        orderId,
        previous: previousStatus,
        new: newStatus,
        changedById,
        changedByRole,
        note,
        mediaUrls: mediaUrls || [],
        batchId
      }
    })

    return updatedOrder
  })
}
