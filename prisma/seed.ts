import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'
import { slugify } from '../src/lib/utils/slugify'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Démarrage du seed...')

  // 1. Catégories
  const categories = [
    { name: 'Mode', slug: 'mode' },
    { name: 'Sacs & Maroquinerie', slug: 'sacs-maroquinerie' },
    { name: 'Chaussures', slug: 'chaussures' },
    { name: 'Accessoires', slug: 'accessoires' },
    { name: 'Beauté', slug: 'beaute' },
    { name: 'Maison & Déco', slug: 'maison-deco' },
    { name: 'Électronique légère', slug: 'electronique-legere' },
    { name: 'Achats sur demande', slug: 'achats-sur-demande' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Catégories créées')

  // 2. Pays
  const countries = [
    { name: 'Émirats arabes unis', code: 'AE', flag: '🇦🇪' },
    { name: 'Turquie', code: 'TR', flag: '🇹🇷' },
    { name: 'Chine', code: 'CN', flag: '🇨🇳' },
  ]

  const createdCountries = []
  for (const country of countries) {
    const c = await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    })
    createdCountries.push(c)
  }
  console.log('✅ Pays créés')

  // 3. Création de Profils Vendeurs Démo
  const demoVendorId1 = 'demo-vendor-id-1'
  const demoVendorId2 = 'demo-vendor-id-2'
  
  await (prisma as any).profile.upsert({
    where: { id: demoVendorId1 },
    update: {},
    create: {
      id: demoVendorId1,
      email: 'vendor1@sharufa.com',
      firstName: 'Jean',
      lastName: 'Dubai',
      role: 'VENDOR',
      vendorStatus: 'APPROVED'
    }
  })

  await (prisma as any).profile.upsert({
    where: { id: demoVendorId2 },
    update: {},
    create: {
      id: demoVendorId2,
      email: 'vendor2@sharufa.com',
      firstName: 'Ahmet',
      lastName: 'Istanbul',
      role: 'VENDOR',
      vendorStatus: 'APPROVED'
    }
  })
  console.log('✅ Profils vendeurs créés')

  // 4. Boutiques
  const shops = [
    {
      name: 'Dubai Gold Fashion',
      slug: 'dubai-gold-fashion',
      description: 'Luxe et élégance tout droit venus de Dubaï. Abayas, bijoux et accessoires haut de gamme.',
      country: 'Émirats arabes unis',
      ownerId: demoVendorId1,
      isVisible: true,
      status: 'APPROVED',
      logo: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Istanbul Leather Hub',
      slug: 'istanbul-leather-hub',
      description: 'Le meilleur du cuir turc : sacs, vestes et chaussures faits main.',
      country: 'Turquie',
      ownerId: demoVendorId2,
      isVisible: true,
      status: 'APPROVED',
      logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400'
    }
  ]

  const createdShops = []
  for (const shop of shops) {
    const s = await (prisma as any).shop.upsert({
      where: { slug: shop.slug },
      update: {},
      create: shop,
    })
    createdShops.push(s)
  }
  console.log('✅ Boutiques créées')

  // 5. Produits
  const products = [
    {
      name: 'Abaya de Luxe Ornée',
      description: 'Abaya perlée à la main avec finitions en soie.',
      price: 249.99,
      stock: 10,
      images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=400'],
      categorySlug: 'mode',
      shopSlug: 'dubai-gold-fashion',
      countryCode: 'AE'
    },
    {
      name: 'Sac à Main Cuir Artisanal',
      description: 'Cuir véritable tanné selon des méthodes ancestrales.',
      price: 120.00,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1584917663903-b93558673822?auto=format&fit=crop&q=80&w=400'],
      categorySlug: 'sacs-maroquinerie',
      shopSlug: 'istanbul-leather-hub',
      countryCode: 'TR'
    }
  ]

  for (const product of products) {
    const cat = await prisma.category.findUnique({ where: { slug: product.categorySlug } })
    const shop = await (prisma as any).shop.findUnique({ where: { slug: product.shopSlug } })
    const country = await prisma.country.findUnique({ where: { code: product.countryCode } })

    if (cat && shop && country) {
      await prisma.product.upsert({
        where: { slug: slugify(product.name) },
        update: {},
        create: {
          name: product.name,
          slug: slugify(product.name),
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.images,
          categoryId: cat.id,
          shopId: shop.id,
          originCountryId: country.id
        }
      })
    }
  }
  console.log('✅ Produits créés')

  // 6. Corridors logistiques
  const corridors = [
    { origin: 'AE', destination: 'FR', transportType: 'AIR', estimatedDays: '3-5 jours', pricePerKg: 12.5 },
    { origin: 'TR', destination: 'FR', transportType: 'ROAD', estimatedDays: '7-10 jours', pricePerKg: 5.5 },
    { origin: 'CN', destination: 'FR', transportType: 'SEA', estimatedDays: '30-45 jours', pricePerKg: 2.0 },
  ]

  for (const corridor of corridors) {
    await (prisma as any).shippingCorridor.create({
      data: {
        origin: corridor.origin,
        destination: corridor.destination,
        transportType: corridor.transportType as any,
        estimatedDays: corridor.estimatedDays,
        pricePerKg: corridor.pricePerKg,
        isActive: true
      }
    })
  }
  console.log('✅ Corridors logistiques créés')

  console.log('🏁 Seed terminé avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
