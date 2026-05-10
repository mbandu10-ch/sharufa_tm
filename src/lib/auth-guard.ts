'use server'

import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export type AuthenticatedUser = {
  id: string
  email: string
  role: Role
  cargoId: string | null
}

/**
 * Vérifie que l'utilisateur est authentifié.
 * Retourne le profil ou une erreur.
 */
export async function requireAuth(): Promise<
  { user: AuthenticatedUser; error?: never } | { user?: never; error: string }
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié.' }
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, role: true, cargoId: true }
  })

  if (!profile) {
    return { error: 'Profil introuvable.' }
  }

  return {
    user: {
      id: profile.id,
      email: profile.email || user.email || '',
      role: profile.role,
      cargoId: profile.cargoId
    }
  }
}

/**
 * Vérifie que l'utilisateur est authentifié ET possède le rôle requis.
 * Accepte un rôle unique ou un tableau de rôles autorisés.
 */
export async function requireRole(role: Role | Role[]): Promise<
  { user: AuthenticatedUser; error?: never } | { user?: never; error: string }
> {
  const result = await requireAuth()

  if (result.error) return result

  const allowedRoles = Array.isArray(role) ? role : [role]

  if (!allowedRoles.includes(result.user!.role)) {
    return { error: 'Accès refusé. Permissions insuffisantes.' }
  }

  return result
}

/**
 * Vérifie que l'utilisateur est le propriétaire d'une boutique donnée.
 */
export async function requireShopOwner(shopId: string): Promise<
  { user: AuthenticatedUser; error?: never } | { user?: never; error: string }
> {
  const result = await requireAuth()

  if (result.error) return result

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    select: { ownerId: true }
  })

  if (!shop) {
    return { error: 'Boutique introuvable.' }
  }

  // Les admins ont accès à toutes les boutiques
  if (result.user!.role === 'ADMIN') return result

  if (shop.ownerId !== result.user!.id) {
    return { error: 'Vous n\'êtes pas le propriétaire de cette boutique.' }
  }

  return result
}
