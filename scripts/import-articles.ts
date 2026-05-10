import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Initialisation Prisma (identique au seed)
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Initialisation Supabase Admin (Service Role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const ARTICLES_DIR = path.join(process.cwd(), 'Articles')

async function ensureBucket(bucketName: string) {
  const { data: buckets, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error('❌ Erreur lors de la récupération des buckets :', error.message)
    return
  }

  const exists = buckets.find(b => b.name === bucketName)
  if (!exists) {
    console.log(`🪣 Création du bucket "${bucketName}"...`)
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    })
    if (createError) {
      console.error(`❌ Impossible de créer le bucket "${bucketName}" :`, createError.message)
    }
  }
}

/**
 * Normalise en minuscules, remplace les espaces et caractères spéciaux par des tirets.
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log('🚀 Démarrage de l\'importation des articles...')
  await ensureBucket('products')

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`❌ Dossier ${ARTICLES_DIR} non trouvé.`)
    process.exit(1)
  }

  // 1. Récupérer ou créer la boutique "Sharufa Store"
  let shop = await prisma.shop.findUnique({ where: { slug: 'sharufa-store' } })
  if (!shop) {
    console.log('🏪 Création de la boutique Sharufa Store...')
    
    // On crée un profil dédié pour la boutique officielle s'il n'existe pas
    let owner = await prisma.profile.findUnique({ where: { id: '1ec11425-cc10-4df9-bb33-f6bba5d38c6c' } })
    if (!owner) {
        console.log('👤 Création du profil Admin Officiel Sharufa...')
        owner = await prisma.profile.create({
            data: {
                id: '1ec11425-cc10-4df9-bb33-f6bba5d38c6c',
                email: 'nsharufa@sharufa.com',
                firstName: 'Sharufa',
                lastName: 'Official',
                role: 'ADMIN',
                vendorStatus: 'APPROVED'
            }
        })
    }

    shop = await prisma.shop.create({
      data: {
        name: 'Sharufa Store',
        slug: 'sharufa-store',
        description: 'Boutique officielle Sharufa.com',
        status: 'APPROVED',
        isVisible: true,
        ownerId: owner.id
      }
    })
  }

  // 2. Récupérer la catégorie "Mode"
  const category = await prisma.category.findUnique({ where: { slug: 'mode' } })
  if (!category) {
    console.error('❌ Catégorie "Mode" non trouvée. Veuillez lancer le seed d\'abord.')
    process.exit(1)
  }

  const folders = fs.readdirSync(ARTICLES_DIR).filter(f => {
    return fs.statSync(path.join(ARTICLES_DIR, f)).isDirectory()
  })

  for (const folder of folders) {
    console.log(`\n📦 Traitement de : ${folder}`)
    
    // Format attendu: Nom;Référence;Pays;Tailles;Prix
    const parts = folder.split(';')
    if (parts.length < 5) {
      console.warn(`⚠️ Format invalide pour le dossier "${folder}". Saut...`)
      continue
    }

    const [name, reference, countryName, sizesStr, priceStr] = parts
    const sizes = sizesStr.split('-').map(s => s.trim())
    const price = parseFloat(priceStr.replace(',', '.'))
    
    // Identifier les images et les couleurs
    const folderPath = path.join(ARTICLES_DIR, folder)
    const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    
    const imageUrls: string[] = []
    const colors: string[] = []

    for (const file of files) {
      const colorName = path.parse(file).name // ex: Bleu
      const fileBuffer = fs.readFileSync(path.join(folderPath, file))
      const fileExt = path.extname(file).toLowerCase()
      const fileName = `${reference}-${slugify(colorName)}${fileExt}`
      const filePath = `products/${fileName}`

      let contentType = `image/${fileExt.replace('.', '')}`
      if (contentType === 'image/jpg') contentType = 'image/jpeg'

      console.log(`  📸 Upload de ${colorName}...`)
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true
        })

      if (error) {
        console.error(`  ❌ Erreur upload ${file}:`, error.message)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      imageUrls.push(publicUrl)
      colors.push(colorName)
    }

    // Trouver le pays
    const country = await prisma.country.findFirst({
      where: { name: { contains: countryName, mode: 'insensitive' } }
    })

    // Upsert du produit
    const productSlug = `${slugify(name)}-${reference}`
    
    await prisma.product.upsert({
      where: { reference: reference },
      update: {
        name,
        price,
        sizes,
        colors,
        images: imageUrls,
        description: `Produit importé de ${countryName}. Tailles disponibles : ${sizesStr}.`,
        updatedAt: new Date()
      },
      create: {
        name,
        slug: productSlug,
        reference,
        description: `Produit importé de ${countryName}. Tailles disponibles : ${sizesStr}.`,
        price,
        stock: 100, // Stock par défaut
        images: imageUrls,
        sizes,
        colors,
        isSharufa: true,
        categoryId: category.id,
        shopId: shop.id,
        originCountryId: country?.id
      }
    })

    console.log(`✅ Produit "${name}" (${reference}) importé avec succès.`)
  }

  console.log('\n🏁 Importation terminée !')
}

main()
  .catch(e => {
    console.error('❌ Erreur critique :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
