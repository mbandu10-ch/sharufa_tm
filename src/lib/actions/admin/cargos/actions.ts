'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { CargoType, TransportType } from "@prisma/client"
import { requireRole } from "@/lib/auth-guard"
import crypto from "crypto"

export async function createCargoPartner(data: {
  hub: {
    name: string
    country: string
    destinationCountry: string
    city: string
    address: string
    contact?: string
    active: boolean
    transportType: TransportType
  },
  user: {
    email: string
    password?: string
  }
}) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    // 1. Create Hub with transport type
    const hub = await prisma.cargo.create({
      data: {
        name: data.hub.name,
        originCountry: data.hub.country,
        destinationCountry: data.hub.destinationCountry,
        city: data.hub.city,
        warehouseAddress: data.hub.address,
        contact: data.hub.contact,
        isActive: data.hub.active,
        cargoType: CargoType.PARTNER,
        transportType: data.hub.transportType
      }
    })

    // 2. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.user.email,
      password: data.user.password || crypto.randomBytes(12).toString('base64'),
      email_confirm: true
    })

    if (authError) {
      await prisma.cargo.delete({ where: { id: hub.id } })
      throw authError
    }

    // 3. Create Profile with mustChangePassword = true
    await prisma.profile.create({
      data: {
        id: authData.user.id,
        email: data.user.email,
        role: 'CARGO',
        cargoId: hub.id,
        firstName: "Partenaire",
        lastName: data.hub.name,
        mustChangePassword: true
      }
    })

    revalidatePath('/admin/cargos')
    return { success: true }
  } catch (error: any) {
    console.error('Unified Create Cargo Error:', error)
    return { error: error.message || "Erreur lors de la création du partenaire cargo." }
  }
}

export async function deleteCargoPartner(id: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    // 1. Vérifier les dépendances
    const orderCount = await prisma.order.count({ where: { cargoId: id } })
    if (orderCount > 0) {
      throw new Error(`Suppression impossible : ce hub possède ${orderCount} commande(s). Désactivez-le plutôt.`)
    }

    // 2. Déclasser les agents rattachés
    await prisma.profile.updateMany({
      where: { cargoId: id },
      data: { cargoId: null, role: 'CLIENT' }
    })

    // 3. Supprimer le Hub
    await prisma.cargo.delete({ where: { id } })

    revalidatePath('/admin/cargos')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function createCargoUser(data: {
  email: string
  password?: string
  cargoId: string
}) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password || crypto.randomBytes(12).toString('base64'),
      email_confirm: true
    })

    if (authError) throw authError

    const profile = await prisma.profile.create({
      data: {
        id: authData.user.id,
        email: data.email,
        role: 'CARGO',
        cargoId: data.cargoId,
        firstName: "Agent",
        lastName: "Logistique",
        mustChangePassword: true
      }
    })

    revalidatePath('/admin/cargos')
    return { success: true, profile }
  } catch (error: any) {
    console.error('Create Cargo User Error:', error)
    return { error: error.message || "Erreur lors de la création de l'utilisateur cargo." }
  }
}

export async function toggleCargoStatus(id: string, isActive: boolean) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    await prisma.cargo.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath('/admin/cargos')
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la mise à jour du statut." }
  }
}
