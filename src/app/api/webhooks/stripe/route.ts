import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature')

  if (!signature) {
    return new NextResponse('Missing stripe signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === 'checkout.session.completed') {
    const orderId = session.metadata?.orderId
    const clientId = session.metadata?.clientId

    if (!orderId || !clientId) {
      return new NextResponse('Webhook Error: Missing metadata', { status: 400 })
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Update Order
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
          }
        })

        // Create Payment record
        await tx.payment.create({
          data: {
            orderId: orderId,
            profileId: clientId,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency?.toUpperCase() || 'USD',
            status: 'PAID',
            method: 'STRIPE',
            transactionId: session.payment_intent as string || session.id
          }
        })
      })

      // Create Financial Entry for the Seller after transaction success
      const { createFinancialEntry } = await import('@/lib/actions/admin/finance/actions')
      await createFinancialEntry(orderId)

      return new NextResponse('Webhook Processed', { status: 200 })
    } catch (err: any) {
      console.error('Prisma Error Processing Webhook', err)
      return new NextResponse('Webhook Error: Database failure', { status: 500 })
    }
  }

  return new NextResponse('Webhook Ignored', { status: 200 })
}
