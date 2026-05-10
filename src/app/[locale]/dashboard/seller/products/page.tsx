import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SellerProductsClient } from '@/components/seller/SellerProductsClient'

export default async function SellerProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch shop
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  let shop = profile?.shop
  if (!shop && profile?.role === 'ADMIN') {
    shop = await prisma.shop.findUnique({ where: { slug: 'sharufa-store' } })
  }

  if (!shop) {
    redirect('/dashboard/buyer')
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
    include: { category: true, originCountry: true }
  })

  // Fetch categories for the bulk update modal
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { parent: { include: { parent: true } } }
  })

  // Format products for the client component
  const formattedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    reference: p.reference,
    price: p.price,
    stock: p.stock,
    status: p.status,
    images: p.images,
    categoryId: p.categoryId,
    category: p.category ? { name: p.category.name } : null
  }))

  return (
    <SellerProductsClient 
      products={formattedProducts} 
      categories={categories as any} 
      shopType={shop.type}
      allowedCategoryIds={shop.allowedCategoryIds || []}
    />
  )
}

