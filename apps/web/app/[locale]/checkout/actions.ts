'use server'

import { prisma } from '@sharufa/db'
import { resolveStandardCountryName } from '@/lib/logistics/country-utils'
import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { calculateFreightOptions, FreightCalcItem } from '@/lib/logistics/freight'
import { TransportType, FreightPaymentMode } from '@prisma/client'
import { stripe } from '@/lib/stripe'
import { checkRateLimit } from '@/lib/rate-limit'


export async function getUserAddresses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  try {
    const addresses = await prisma.address.findMany({
      where: { profileId: user.id },
      orderBy: { isDefault: 'desc' }
    })
    return { success: true, addresses }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return { error: 'Erreur lors de la récupération des adresses' }
  }
}

export async function getFreightEstimate(addressId: string, cartItems: {id: string, quantity: number}[]) {
  try {
    const address = await prisma.address.findUnique({ where: { id: addressId } })
    if (!address) return { error: "Adresse invalide." }
    
    const destinationCountry = address.country
    
    // Fetch product details for dimensions
    let originCountry = "Turkey" // fallback
    const freightItems: FreightCalcItem[] = []
    
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        include: { originCountry: true, shop: true }
      })
      if (product) {
        if (product.originCountry?.name) originCountry = product.originCountry.name
        else if (product.shop?.country) originCountry = product.shop.country
        
        freightItems.push({
          quantity: item.quantity,
          weight: product.weight,
          length: product.length,
          width: product.width,
          height: product.height
        })
      }
    }
    
    const result = await calculateFreightOptions(originCountry, destinationCountry, freightItems)
    return { success: true, options: result.options }
  } catch (err) {
    console.error("Freight Estimate error", err)
    return { error: "Erreur lors du calcul du fret." }
  }
}

export async function createOrder(data: {
  items: { id: string; quantity: number; price: number; selectedSize?: string; selectedColor?: string }[]
  totalAmount: number
  addressId: string
  freightEstimatedAmount?: number
  transportMode?: TransportType
  freightPaymentMode?: FreightPaymentMode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Vous devez être connecté pour passer une commande." }
  }

  // Rate Limiting
  const rateLimit = await checkRateLimit(user.id, 'checkout')
  if (!rateLimit.allowed) {
    return { error: `Trop de commandes. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
  }


  try {
    // Generate a unique order number
    const orderNumber = `SH-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Get the address details to store as a string in the order
    const address = await prisma.address.findUnique({
      where: { id: data.addressId }
    })

    if (!address) {
      return { error: "Adresse de livraison introuvable." }
    }

    // SECURITY: Verify address belongs to the authenticated user
    if (address.profileId !== user.id) {
      return { error: "Adresse invalide." }
    }

    // SECURITY: Recalculate totalAmount from actual DB prices (never trust client-side amount)
    let serverTotalAmount = 0
    const verifiedItems: { id: string; quantity: number; price: number; selectedSize?: string; selectedColor?: string }[] = []

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { id: true, price: true, stock: true, status: true, minOrderQuantity: true }
      })

      if (!product || product.status !== 'APPROVED') {
        return { error: `Le produit sélectionné n'est plus disponible.` }
      }

      if (product.stock < item.quantity) {
        return { error: `Stock insuffisant pour un des produits.` }
      }

      if (item.quantity < product.minOrderQuantity) {
        return { error: `Quantité minimum non respectée pour un des produits.` }
      }

      serverTotalAmount += product.price * item.quantity
      verifiedItems.push({
        ...item,
        price: product.price // Use server price, not client price
      })
    }

    const destinationCountry = resolveStandardCountryName(address.country)
    const addressString = `${address.fullName}, ${address.street}, ${address.city}, ${address.country} (${address.phone})`

    // Determine the origin country and primary shop from the first product
    let originCountry = "Sharufa Central"
    let primaryShopId = null
    if (verifiedItems.length > 0) {
      const firstProduct = await prisma.product.findUnique({
        where: { id: verifiedItems[0].id },
        include: { shop: true }
      })
      if (firstProduct?.shop?.country) {
        originCountry = resolveStandardCountryName(firstProduct.shop.country)
      }
      if (firstProduct?.shopId) {
        primaryShopId = firstProduct.shopId
      }
    }
    
    // Resolve cargo assignment
    const assignedCargo = await prisma.cargo.findFirst({
      where: {
        originCountry,
        destinationCountry,
        isActive: true,
        ...(data.transportMode ? {
          transportType: data.transportMode
        } : {})
      }
    })

    // Create the order and items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          clientId: user.id,
          shopId: primaryShopId,
          totalAmount: serverTotalAmount, // Use server-calculated amount
          shippingAddress: addressString,
          originCountry,
          destinationCountry,
          cargoId: assignedCargo?.id,
          freightEstimatedAmount: data.freightEstimatedAmount,
          transportMode: data.transportMode,
          freightPaymentMode: data.freightPaymentMode,
          currency: "USD",
          status: 'NEW',
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price, // Server-verified price
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor
            }))
          }
        }
      })

      return newOrder
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Commande #${order.orderNumber} - Sharufa`,
              description: `Commande contenant ${data.items.length} article(s)`,
            },
            unit_amount: Math.round(serverTotalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?orderNumber=${order.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientId: user.id
      }
    })

    // Remove direct revalidation as the webhook will handle status updates later
    return { success: true, orderId: order.id, orderNumber: order.orderNumber, checkoutUrl: session.url }
  } catch (error) {
    console.error('Create Order Error:', error)
    return { error: "Une erreur est survenue lors de la création de la commande." }
  }
}
