import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const prismaClientSingleton = () => {
  let connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  
  if (connectionString && connectionString.includes('sslmode=')) {
    connectionString = connectionString.replace(/sslmode=[^&?]+/g, 'sslmode=no-verify')
  }

  const pool = new Pool({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    }
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const prisma = prismaClientSingleton()

async function main() {
  console.log('--- Start Seeding Premium Attribute Templates ---')

  const casMapping = [
    {
      domain: 'Véhicules & Mobilité',
      category: 'Voitures',
      attributes: [
        { key: 'manufacturer', label: 'Fabricant', type: 'TEXT', required: true },
        { key: 'model', label: 'Modèle', type: 'TEXT', required: true },
        { key: 'year', label: 'Année', type: 'NUMBER', required: true },
        { key: 'mileage', label: 'Kilométrage (km)', type: 'NUMBER', required: true },
        { key: 'fuel_type', label: 'Carburant', type: 'SELECT', options: ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'] },
        { key: 'transmission', label: 'Transmission', type: 'SELECT', options: ['Manuelle', 'Automatique'] },
        { key: 'condition', label: 'État', type: 'SELECT', options: ['Neuf', 'Occasion (Excellent)', 'Occasion (Bon)', 'Occasion (Moyen)'] },
        { key: 'color', label: 'Couleur', type: 'TEXT' },
        { key: 'seats', label: 'Nombre de places', type: 'NUMBER' },
        { key: 'doors', label: 'Nombre de portes', type: 'NUMBER' },
        { key: 'engine_capacity', label: 'Cylindrée', type: 'TEXT' },
      ]
    },
    {
      domain: 'Mode & Accessoires',
      category: 'Vêtements',
      attributes: [
        { key: 'size', label: 'Taille', type: 'SELECT', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44', '46'] },
        { key: 'color', label: 'Couleur', type: 'TEXT' },
        { key: 'material', label: 'Matière', type: 'TEXT' },
        { key: 'fit', label: 'Coupe', type: 'SELECT', options: ['Slim', 'Regular', 'Oversized', 'Skinny'] },
        { key: 'gender', label: 'Genre', type: 'SELECT', options: ['Homme', 'Femme', 'Unisexe', 'Enfant'] },
        { key: 'season', label: 'Saison', type: 'SELECT', options: ['Été', 'Hiver', 'Printemps/Automne', 'Toutes saisons'] },
        { key: 'brand', label: 'Marque', type: 'TEXT' },
      ]
    },
    {
      domain: 'Mode & Accessoires',
      category: 'Sacs',
      attributes: [
        { key: 'material', label: 'Matière', type: 'TEXT' },
        { key: 'dimensions', label: 'Dimensions', type: 'TEXT' },
        { key: 'color', label: 'Couleur', type: 'TEXT' },
        { key: 'closure_type', label: 'Type de fermeture', type: 'SELECT', options: ['Fermeture éclair', 'Bouton pression', 'Magnétique', 'Cordon'] },
        { key: 'brand', label: 'Marque', type: 'TEXT' },
      ]
    },
    {
      domain: 'Alimentaire & Denrées',
      category: null, // Si null, on applique au domaine entier ou on cherchera des sous-cats
      attributes: [
        { key: 'weight', label: 'Poids / Volume', type: 'TEXT', required: true },
        { key: 'origin', label: 'Origine', type: 'TEXT' },
        { key: 'expiration_date', label: 'Date d\'expiration', type: 'DATE', required: true },
        { key: 'packaging', label: 'Conditionnement', type: 'TEXT', placeholder: 'Sachet, Carton, Bouteille...' },
        { key: 'storage_condition', label: 'Conditions de stockage', type: 'SELECT', options: ['Ambiant', 'Frais', 'Surgelé'] },
        { key: 'brand', label: 'Marque', type: 'TEXT' },
      ]
    },
    {
      domain: 'Produits ménagers & Hygiène',
      category: null,
      attributes: [
        { key: 'volume', label: 'Volume', type: 'TEXT', required: true },
        { key: 'units_count', label: 'Nombre d\'unités', type: 'NUMBER' },
        { key: 'fragrance', label: 'Parfum / Variante', type: 'TEXT' },
        { key: 'usage_type', label: 'Usage', type: 'TEXT' },
        { key: 'brand', label: 'Marque', type: 'TEXT' },
      ]
    },
    {
      domain: 'Construction & Matériaux',
      category: null,
      attributes: [
        { key: 'material', label: 'Matériau', type: 'TEXT', required: true },
        { key: 'dimensions', label: 'Dimensions', type: 'TEXT' },
        { key: 'weight', label: 'Poids', type: 'TEXT' },
        { key: 'unit', label: 'Unité de vente', type: 'SELECT', options: ['Unité', 'm2', 'm3', 'Tonne', 'Sac'] },
        { key: 'usage', label: 'Utilisation', type: 'TEXT' },
        { key: 'strength', label: 'Résistance / Grade', type: 'TEXT' },
      ]
    },
    {
      domain: 'Électronique & Technologie',
      category: null,
      attributes: [
        { key: 'brand', label: 'Marque', type: 'TEXT', required: true },
        { key: 'model', label: 'Modèle', type: 'TEXT', required: true },
        { key: 'storage', label: 'Stockage', type: 'TEXT' },
        { key: 'ram', label: 'RAM', type: 'TEXT' },
        { key: 'warranty', label: 'Garantie', type: 'TEXT' },
        { key: 'condition', label: 'État', type: 'SELECT', options: ['Neuf', 'Reconditionné (Grade A)', 'Reconditionné (Grade B)', 'Occasion'] },
      ]
    }
  ]

  for (const cas of casMapping) {
    const domain = await prisma.category.findFirst({
      where: { name: cas.domain, parentId: null }
    })

    if (!domain) {
      console.warn(`Domain not found: ${cas.domain}`)
      continue
    }

    let targetCategoryId = domain.id

    if (cas.category) {
      let category = await prisma.category.findFirst({
        where: { name: cas.category, parentId: domain.id }
      })
      
      if (!category) {
        console.log(`Creating missing category: ${cas.category} under ${cas.domain}`)
        category = await prisma.category.create({
          data: {
            name: cas.category,
            slug: `${cas.category.toLowerCase().replace(/ /g, '-')}-${domain.slug}`,
            parentId: domain.id
          }
        })
      }
      targetCategoryId = category.id
    }

    console.log(`Seeding attributes for: ${cas.domain} ${cas.category ? `> ${cas.category}` : ''}`)

    for (const attr of cas.attributes) {
      await (prisma as any).categoryAttributeTemplate.upsert({
        where: {
          categoryId_fieldKey: {
            categoryId: targetCategoryId,
            fieldKey: attr.key
          }
        },
        update: {
          label: attr.label,
          fieldType: attr.type,
          required: attr.required || false,
          options: attr.options ?? undefined,
        },
        create: {
          categoryId: targetCategoryId,
          fieldKey: attr.key,
          label: attr.label,
          fieldType: attr.type,
          required: attr.required || false,
          options: attr.options ?? undefined,
        }
      })
    }
  }

  console.log('--- Seeding Completed ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
