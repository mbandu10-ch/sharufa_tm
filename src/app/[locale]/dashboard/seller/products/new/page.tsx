import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import AddProductForm from '@/components/seller/AddProductForm'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { shop: true }
  })

  let shop = profile?.shop
  if (!shop && profile?.role === 'ADMIN') {
    shop = await prisma.shop.findUnique({ where: { slug: 'sharufa-store' } })
  }

  if (!shop) redirect('/dashboard/buyer')

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { parent: { include: { parent: true } } }
  })

  const countries = await prisma.country.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/seller/products" 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-black font-outfit text-primary tracking-tighter italic">Nouveau Produit</h1>
      </div>

      <AddProductForm 
        shopType={shop.type}
        categories={categories as any} 
        countries={countries} 
      />
    </div>
  )
}
