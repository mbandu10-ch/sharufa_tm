import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AddProductForm from '@/components/seller/AddProductForm'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Store } from 'lucide-react'
import Link from 'next/link'
import { SHOP_DOMAIN_MAPPING } from '@/lib/constants/shop-categories'
import { ShopType } from '@prisma/client'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Vérifier si l'utilisateur a une boutique et son statut
  const shop = await prisma.shop.findUnique({
    where: { ownerId: user.id },
    select: { id: true, name: true, type: true, status: true, allowedCategoryIds: true }
  })

  // Si pas de boutique OU boutique non approuvée
  if (!shop || (shop as any).status !== 'APPROVED') {
    return (
      <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center">
          <Store size={40} className="text-secondary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-outfit font-bold">Un instant...</h1>
          <p className="text-muted-foreground max-w-md">
            {shop?.status === 'PENDING' 
              ? "Votre boutique est en cours de validation. Vous pourrez ajouter des produits dès qu'elle sera approuvée."
              : "Vous devez posséder une boutique approuvée pour pouvoir ajouter des produits."}
          </p>
        </div>
        <Link 
          href="/seller/register" 
          className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
        >
          {shop ? "Voir le statut" : "Créer ma boutique"}
        </Link>
      </div>
    )
  }

  // Charger les catégories autorisées
  // On récupère les catégories qui appartiennent aux domaines autorisés pour ce TYPE de boutique
  const allowedDomainNames = SHOP_DOMAIN_MAPPING[shop!.type as ShopType] || []
  
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
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-secondary transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour au Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary tracking-tight">
              Nouveau Produit
            </h1>
            <p className="text-muted-foreground text-lg">
              Ajoutez un article à l'inventaire de <span className="text-secondary font-bold">{shop.name}</span>.
            </p>
          </div>
        </div>

        <AddProductForm 
          categories={categories as any} 
          countries={countries} 
          shopType={shop!.type as ShopType} 
        />
      </div>
    </div>
  )
}
