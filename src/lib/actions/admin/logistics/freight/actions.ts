'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { TransportType } from '@prisma/client'
import { requireRole } from '@/lib/auth-guard'

export async function createFreightRule(data: {
  originCountry: string
  destinationCountry: string
  transportMode: TransportType
  pricePerKg?: number
  pricePerCbm?: number
  minimumCharge: number
  volumetricDivisor: number
  allowPayAtDestination: boolean
  estimatedMinDays: number
  estimatedMaxDays: number
}) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    await prisma.freightRule.create({
      data: {
        originCountry: data.originCountry,
        destinationCountry: data.destinationCountry,
        transportMode: data.transportMode,
        pricePerKg: data.pricePerKg || null,
        pricePerCbm: data.pricePerCbm || null,
        minimumCharge: data.minimumCharge,
        volumetricDivisor: data.volumetricDivisor,
        allowPayAtDestination: data.allowPayAtDestination,
        estimatedMinDays: data.estimatedMinDays,
        estimatedMaxDays: data.estimatedMaxDays
      }
    })

    revalidatePath('/admin/logistics/freight')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating freight rule:', error)
    if (error.code === 'P2002') return { error: 'Une règle existe déjà pour cette route et ce transport.' }
    return { error: 'Erreur lors de la création de la règle de fret.' }
  }
}

export async function toggleFreightRuleStatus(id: string, isActive: boolean) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    await prisma.freightRule.update({
      where: { id },
      data: { isActive }
    })

    revalidatePath('/admin/logistics/freight')
    return { success: true }
  } catch (error) {
    return { error: 'Erreur lors de la mise à jour.' }
  }
}

export async function deleteFreightRule(id: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    await prisma.freightRule.delete({
      where: { id }
    })

    revalidatePath('/admin/logistics/freight')
    return { success: true }
  } catch (error) {
    return { error: 'Erreur lors de la suppression.' }
  }
}
