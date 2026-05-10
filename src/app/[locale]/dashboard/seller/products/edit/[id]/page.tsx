import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import AddProductForm from '@/components/seller/AddProductForm'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const product = await prisma.product.findUnique({
    where: { id },
    include: { shop: true, originCountry: true }
  })

  if (!product) notFound()

  // Security check: Must be the shop owner or admin
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  const isOwner = profile?.shop?.id === product.shopId
  const isAdmin = profile?.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    redirect('/dashboard/seller/products')
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { parent: { include: { parent: true } } }
  })

  const countries = await prisma.country.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  })

  // Safe cast or mapping for initialData
  const initialData = {
     ...product,
     images: product.images,
     attributes: product.attributes,
     originCountryId: product.originCountryId
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/seller/products" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-black font-outfit text-primary tracking-tighter italic">Modifier le Produit</h1>
      </div>

      <AddProductForm 
        shopType={product.shop?.type || 'GENERAL_STORE'} 
        categories={categories as any} 
        countries={countries}
        initialData={initialData as any}
      />
    </div>
  )
}
