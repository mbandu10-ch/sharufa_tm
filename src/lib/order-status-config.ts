import { LogisticsStatus, Role } from '@prisma/client'

/**
 * Validates if a status transition is allowed for a given role.
 * This is the central source of truth for allowed transitions.
 */
export const ALLOWED_TRANSITIONS: Record<Role, Partial<Record<LogisticsStatus, LogisticsStatus[]>>> = {
  VENDOR: {
    NEW_ORDER: ['DROPPED_AT_CARGO'],
    REJECTED_BY_CARGO: ['DROPPED_AT_CARGO'], // "Commande corrigée"
  },
  CARGO: {
    DROPPED_AT_CARGO: ['RECEIVED_BY_CARGO', 'REJECTED_BY_CARGO'],
    RECEIVED_BY_CARGO: ['SHIPPED'],
    SHIPPED: ['IN_TRANSIT'],
    IN_TRANSIT: ['READY_FOR_DELIVERY'],
    READY_FOR_DELIVERY: ['DELIVERED'],
  },
  ADMIN: {},
  CLIENT: {}
}

export const BUYER_STATUS_LABELS: Partial<Record<LogisticsStatus, string>> = {
  NEW_ORDER: 'En préparation',
  TO_PREPARE: 'En préparation',
  READY_FOR_DROPOFF: 'En préparation',
  DROPPED_AT_CARGO: 'En préparation',
  RECEIVED_BY_CARGO: 'Livré au cargo',
  VERIFIED_COMPLIANT: 'Livré au cargo',
  SHIPPED: 'En transit',
  IN_TRANSIT: 'En transit',
  READY_FOR_DELIVERY: 'Prêt pour livraison',
  DELIVERED: 'Livré',
}

export function getBuyerStatusLabel(status: LogisticsStatus): string {
  return BUYER_STATUS_LABELS[status] || status.replace(/_/g, ' ')
}

export function isTransitionAllowed(role: Role, currentStatus: LogisticsStatus, nextStatus: LogisticsStatus): boolean {
  if (role === 'ADMIN') return true
  const allowed = ALLOWED_TRANSITIONS[role]?.[currentStatus]
  return allowed?.includes(nextStatus) ?? false
}
