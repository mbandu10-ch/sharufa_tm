import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AddProductForm from '@/components/seller/AddProductForm'
import { ShopType } from '@prisma/client'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const shop = await prisma.shop.findUnique({
    where: { ownerId: user.id }
  })

  if (!shop) {
    redirect('/seller/register')
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-outfit font-black text-primary tracking-tight">
          AJOUTER UN <span className="text-secondary italic">PRODUIT</span>
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Remplissez les informations ci-dessous pour mettre votre article en vente.
        </p>
      </div>

      <AddProductForm 
        categories={categories} 
        countries={countries} 
        shopType={shop.type as ShopType} 
        allowedCategoryIds={shop.allowedCategoryIds}
      />
    </div>
  )
}
