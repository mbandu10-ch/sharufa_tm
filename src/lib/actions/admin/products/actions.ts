'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ProductStatus } from "@prisma/client"
import { requireRole } from "@/lib/auth-guard"

/**
 * Met à jour le statut d'un produit avec traçabilité complète.
 */
export async function updateProductStatus(
  productId: string, 
  status: ProductStatus, 
  rejectionReason?: string,
  adminNotes?: string
) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { 
        status,
        rejectionReason: status === 'REJECTED' || status === 'NEEDS_CORRECTION' ? rejectionReason : null,
        adminNotes: adminNotes || undefined,
        updatedAt: new Date()
      }
    })

    // Log de l'événement d'audit
    await prisma.productEvent.create({
      data: {
        productId,
        adminId: auth.user!.id,
        eventType: "STATUS_UPDATED",
        message: `Statut mis à jour vers ${status}.${rejectionReason ? ` Raison: ${rejectionReason}` : ''}`,
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${productId}`)
    return { success: true, product }
  } catch (error: any) {
    console.error('Error updating product status:', error)
    return { error: 'Échec de la mise à jour du statut produit.' }
  }
}

/**
 * Correction administrative d'un produit (catégorie, attributs, etc.)
 */
export async function updateProductDetails(
  productId: string,
  data: {
    categoryId?: string
    attributes?: any
    name?: string
    price?: number
    stock?: number
  }
) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    await prisma.productEvent.create({
      data: {
        productId,
        adminId: auth.user!.id,
        eventType: "PRODUCT_CORRECTED",
        message: `Correction administrative effectuée sur les champs : ${Object.keys(data).join(', ')}`,
      }
    })

    revalidatePath(`/admin/products/${productId}`)
    return { success: true, product }
  } catch (error: any) {
    console.error('Error correcting product details:', error)
    return { error: 'Échec de la correction du produit.' }
  }
}

/**
 * Récupère l'historique complet d'un produit.
 */
export async function getProductEvents(productId: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return []

  return await prisma.productEvent.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' }
  })
}
