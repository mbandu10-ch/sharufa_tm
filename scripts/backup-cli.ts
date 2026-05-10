import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runBackup() {
  try {
    console.log('Starting CLI-based product backup...');
    
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
    });

    const backupData = products.map(product => {
      let sellerType = 'RETAIL';
      if (product.shop?.type === 'WHOLESALE_STORE') {
        sellerType = 'WHOLESALE_STORE';
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
      };
    });

    const fileName = `products-backup-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = path.join(process.cwd(), fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    console.log(`Successfully exported ${backupData.length} products to ${fileName}`);
    process.exit(0);
  } catch (error: any) {
    console.error('Backup error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runBackup();
