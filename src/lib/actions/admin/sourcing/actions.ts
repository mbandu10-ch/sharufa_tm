'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { SourcingStatus, SourcingType } from "@prisma/client"
import { requireRole, requireAuth } from "@/lib/auth-guard"
import crypto from "crypto"

export async function createSourcingRequest(data: {
  clientId: string, type: SourcingType, title: string, description: string,
  categoryId?: string, referenceLink?: string, imageUrl?: string,
  requestedQuantity?: number, targetCountry?: string, budget?: number
}) {
  const auth = await requireAuth()
  if (auth.error) return { error: auth.error }
  if (data.clientId !== auth.user!.id && auth.user!.role !== 'ADMIN') {
    return { error: 'Vous ne pouvez pas créer une demande pour un autre utilisateur.' }
  }
  try {
    const request = await prisma.sourcingRequest.create({ data: { ...data, status: 'NEW' } })
    await prisma.sourcingEvent.create({
      data: { sourcingRequestId: request.id, action: "REQUEST_CREATED", message: `Nouvelle demande de sourcing (${data.type}) créée.` }
    })
    revalidatePath('/dashboard/sourcing')
    revalidatePath('/admin/sourcing')
    return { success: true, request }
  } catch (error: any) {
    console.error('Error creating sourcing request:', error)
    return { error: 'Échec de la création de la demande de sourcing.' }
  }
}

export async function createSourcingQuote(data: {
  requestId: string, productCost: number, shippingCost: number, serviceFee: number, notes?: string
}) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }
  try {
    const totalPrice = data.productCost + data.shippingCost + data.serviceFee
    await prisma.quote.updateMany({ where: { sourcingRequestId: data.requestId }, data: { isActive: false } })
    const quote = await prisma.quote.create({
      data: { sourcingRequestId: data.requestId, productCost: data.productCost, shippingCost: data.shippingCost, serviceFee: data.serviceFee, totalPrice, notes: data.notes, isActive: true }
    })
    await prisma.sourcingRequest.update({ where: { id: data.requestId }, data: { status: 'QUOTED' } })
    await prisma.sourcingEvent.create({
      data: { sourcingRequestId: data.requestId, action: "QUOTE_SENT", adminId: auth.user!.id, message: `Un devis de ${totalPrice.toLocaleString()} CFA a été envoyé au client.` }
    })
    revalidatePath(`/admin/sourcing/${data.requestId}`)
    revalidatePath(`/dashboard/sourcing/${data.requestId}`)
    return { success: true, quote }
  } catch (error: any) {
    console.error('Error creating sourcing quote:', error)
    return { error: 'Échec de l\'envoi du devis.' }
  }
}

export async function updateSourcingStatus(requestId: string, status: SourcingStatus, message?: string) {
  const auth = await requireRole('ADMIN')
  if (auth.error) return { error: auth.error }
  try {
    const request = await prisma.sourcingRequest.update({ where: { id: requestId }, data: { status } })
    await prisma.sourcingEvent.create({
      data: { sourcingRequestId: requestId, action: "STATUS_UPDATED", adminId: auth.user!.id, message: `Statut mis à jour vers ${status}.${message ? ` Note: ${message}` : ''}` }
    })
    revalidatePath(`/admin/sourcing/${requestId}`)
    revalidatePath(`/dashboard/sourcing/${requestId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error updating sourcing status:', error)
    return { error: 'Échec de la mise à jour du statut.' }
  }
}

export async function acceptSourcingQuote(requestId: string, quoteId: string) {
  const auth = await requireAuth()
  if (auth.error) return { error: auth.error }
  try {
    const request = await prisma.sourcingRequest.findUnique({ 
      where: { id: requestId }, 
      include: { client: true } 
    })
    const quote = await prisma.quote.findUnique({ where: { id: quoteId } })
    
    if (!request || !quote) return { error: "Demande ou devis introuvable." }
    if (request.clientId !== auth.user!.id && auth.user!.role !== 'ADMIN') {
      return { error: 'Vous ne pouvez pas accepter ce devis.' }
    }

    // 1. Update request status
    await prisma.sourcingRequest.update({ 
      where: { id: requestId }, 
      data: { status: 'ACCEPTED' } 
    })

    // 2. Get or create sourcing category
    let category = await prisma.category.findFirst({ where: { slug: 'sourcing-conciergerie' } })
    if (!category) {
      category = await prisma.category.create({
        data: { name: 'Sourcing & Conciergerie', slug: 'sourcing-conciergerie' }
      })
    }

    // 3. Create a unique product for this sourcing order
    const sourcingProduct = await prisma.product.create({
      data: { 
        name: `Sourcing: ${request.title}`, 
        slug: `sourcing-${request.id.substring(0, 8)}-${crypto.randomBytes(3).toString('hex')}`, 
        description: `Service de sourcing personnalisé pour : ${request.title}. ${request.description}`, 
        price: quote.totalPrice, 
        status: 'APPROVED', 
        categoryId: category.id, 
        isSharufa: true,
        images: request.imageUrl ? [request.imageUrl] : []
      }
    })

    // 4. Create Order with secure order number
    const orderNumber = `SOUR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientId: request.clientId, 
        totalAmount: quote.totalPrice, 
        currency: quote.currency,
        sourceType: 'SOURCING', 
        status: 'NEW', 
        paymentStatus: 'PENDING',
        adminNotes: `Commande générée depuis la demande Sourcing #${request.id}`,
        items: { 
          create: { 
            productId: sourcingProduct.id, 
            quantity: request.requestedQuantity || 1, 
            price: quote.totalPrice 
          } 
        }
      }
    })

    // 5. Log Event
    await prisma.sourcingEvent.create({
      data: { 
        sourcingRequestId: requestId, 
        action: "QUOTE_ACCEPTED", 
        message: `Devis accepté. Commande #${order.orderNumber} créée.` 
      }
    })

    // 6. Notify Client via Email
    if (request.client.email) {
      try {
        const { sendEmail } = await import('@/lib/resend')
        const { SourcingQuoteAcceptedEmail } = await import('@/components/emails/SourcingQuoteAcceptedEmail')
        
        await sendEmail({
          to: request.client.email,
          subject: `Votre devis de sourcing a été accepté - Sharufa`,
          react: SourcingQuoteAcceptedEmail({
            firstName: request.client.firstName || 'Client',
            requestTitle: request.title || 'Demande de Sourcing',
            orderNumber: order.orderNumber,
            totalPrice: quote.totalPrice
          })
        })
      } catch (emailError) {
        console.error('Failed to send sourcing acceptance email:', emailError)
      }
    }

    revalidatePath(`/dashboard/sourcing/${requestId}`)
    return { success: true, orderId: order.id }
  } catch (error: any) {
    console.error('Error accepting sourcing quote:', error)
    return { error: 'Échec de l\'acceptation du devis.' }
  }
}
