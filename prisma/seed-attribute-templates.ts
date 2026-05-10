import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Seeding Attribute Templates...')

  const templates = [
    {
      categorySlug: 'robes-femmes',
      attributes: [
        { fieldKey: 'taille', label: 'Taille', fieldType: 'SELECT', required: true, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        { fieldKey: 'couleur', label: 'Couleur', fieldType: 'TEXT', required: true },
        { fieldKey: 'matiere', label: 'Matière', fieldType: 'TEXT', required: false },
      ]
    },
    {
      categorySlug: 'chaussures-hommes',
      attributes: [
        { fieldKey: 'pointure', label: 'Pointure', fieldType: 'NUMBER', required: true },
        { fieldKey: 'couleur', label: 'Couleur', fieldType: 'TEXT', required: true },
        { fieldKey: 'matiere', label: 'Matière', fieldType: 'TEXT', required: false },
      ]
    },
    {
      categorySlug: 'voitures',
      attributes: [
        { fieldKey: 'marque', label: 'Marque', fieldType: 'SELECT', required: true, options: [
          'Toyota', 'Mercedes-Benz', 'BMW', 'Nissan', 'Hyundai', 'Kia', 'Ford', 
          'Peugeot', 'Renault', 'Volkswagen', 'Mitsubishi', 'Honda', 'Land Rover', 
          'Suzuki', 'Lexus', 'Audi', 'Chevrolet', 'Jeep', 'Mazda'
        ] },
        { fieldKey: 'modele', label: 'Modèle', fieldType: 'TEXT', required: true },
        { fieldKey: 'annee', label: 'Année', fieldType: 'NUMBER', required: true },
        { fieldKey: 'kilometrage', label: 'Kilométrage (km)', fieldType: 'NUMBER', required: false },
        { fieldKey: 'carburant', label: 'Carburant', fieldType: 'SELECT', required: true, options: ['Essence', 'Diesel', 'Électrique', 'Hybride'] },
        { fieldKey: 'couleur', label: 'Couleur', fieldType: 'SELECT', required: true, options: [
          'Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Argent', 'Beige', 'Brun', 'Vert', 'Jaune'
        ] },
        { fieldKey: 'volant', label: 'Côté du volant', fieldType: 'SELECT', required: true, options: ['Gauche', 'Droite'] },
      ]
    },
    {
      categorySlug: 'smartphones-tablettes',
      attributes: [
        { fieldKey: 'marque', label: 'Marque', fieldType: 'TEXT', required: true },
        { fieldKey: 'modele', label: 'Modèle', fieldType: 'TEXT', required: true },
        { fieldKey: 'stockage', label: 'Stockage', fieldType: 'SELECT', required: true, options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
        { fieldKey: 'ram', label: 'RAM', fieldType: 'SELECT', required: false, options: ['4GB', '6GB', '8GB', '12GB', '16GB'] },
        { fieldKey: 'systeme', label: 'Système d\'exploitation', fieldType: 'SELECT', required: true, options: ['iOS', 'Android'] },
      ]
    }
  ]

  for (const t of templates) {
    const category = await prisma.category.findUnique({
      where: { slug: t.categorySlug }
    })

    if (!category) {
      console.warn(`⚠️ Category not found: ${t.categorySlug}`)
      continue
    }

    console.log(`+ Processing ${t.categorySlug}...`)

    for (const attr of t.attributes) {
      await prisma.categoryAttributeTemplate.upsert({
        where: {
          categoryId_fieldKey: {
            categoryId: category.id,
            fieldKey: attr.fieldKey
          }
        },
        update: {
          label: attr.label,
          fieldType: attr.fieldType,
          required: attr.required,
          options: (attr.options || null) as any
        },
        create: {
          categoryId: category.id,
          fieldKey: attr.fieldKey,
          label: attr.label,
          fieldType: attr.fieldType,
          required: attr.required,
          options: (attr.options || null) as any
        }
      })
    }
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
