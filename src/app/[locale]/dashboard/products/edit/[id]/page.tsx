import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import AddProductForm from '@/components/seller/AddProductForm'
import { SHOP_DOMAIN_MAPPING } from '@/lib/constants/shop-categories'
import { ShopType } from '@prisma/client'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage(props: EditProductPageProps) {
  const params = await props.params
  const id = params.id

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Vérifier le produit et l'appartenance
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      shop: true,
    }
  })

  if (!product) {
    notFound()
  }

  // Sécurité : Vérifier que c'est bien la boutique de l'utilisateur
  if (product.shop?.ownerId !== user.id) {
    redirect('/dashboard/products')
  }

  // Charger les catégories autorisées
  // On récupère les catégories qui appartiennent aux domaines autorisés pour ce TYPE de boutique
  const allowedDomainNames = SHOP_DOMAIN_MAPPING[product.shop!.type as ShopType] || []

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { name: { in: allowedDomainNames }, parentId: null },
        { parent: { name: { in: allowedDomainNames }, parentId: null } },
        { parent: { parent: { name: { in: allowedDomainNames }, parentId: null } } },
        { parent: { parent: { parent: { name: { in: allowedDomainNames }, parentId: null } } } }
      ]
    },
    include: {
      parent: {
        include: {
          parent: {
            include: {
              parent: true
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  const countries = await prisma.country.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-outfit font-black text-primary tracking-tight">
          MODIFIER LE <span className="text-secondary italic">PRODUIT</span>
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Mise à jour de : <span className="text-primary font-bold">{product.name}</span>
        </p>
      </div>

      <AddProductForm 
        categories={categories as any} 
        countries={countries} 
        shopType={product.shop!.type as ShopType} 
        initialData={product}
      />
    </div>
  )
}
