import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function exportProducts() {
  console.log('Starting product export...')

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        shop: {
          include: {
            owner: true
          }
        },
        originCountry: true
      }
    })

    const backupData = products.map(product => {
      // Map seller type from shop owner role or status
      let sellerType = 'RETAIL'
      if (product.shop?.type === 'WHOLESALE_STORE') {
        sellerType = 'WHOLESALE_STORE'
      }

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        shopId: product.shopId,
        shopName: product.shop?.name || null,
        country: product.originCountry?.name || null,
        currentCategory: product.category?.name || null,
        min_order_quantity: product.minOrderQuantity || (sellerType === 'WHOLESALE' ? 6 : 1),
        sellerType: sellerType,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })

    const filePath = 'products-backup-before-category-rebuild.json'
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2))

    console.log(`Successfully exported ${backupData.length} products to ${filePath}`)
    
    // Provide a small preview
    if (backupData.length > 0) {
      console.log('\nPreview of the first product structure:')
      console.log(JSON.stringify(backupData[0], null, 2))
    }
  } catch (error) {
    console.error('Error during export:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportProducts()
