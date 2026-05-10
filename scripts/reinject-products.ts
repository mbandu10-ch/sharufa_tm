import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🚀 Démarrage de la réinjection finale (V2)...');

    const dataPath = path.join(process.cwd(), 'products-mapped-v2.json');
    const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Mapping des pays
    const countries = await prisma.country.findMany();
    const countryMap: Record<string, string> = {};
    countries.forEach(c => {
        countryMap[c.name] = c.id;
    });

    console.log('🧹 Nettoyage de la base de données (Table Product)...');
    await prisma.product.deleteMany({});

    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (p: any) => {
            try {
                // Tentative d'extraction des tailles depuis la description si présentes
                let extractedSizes: string[] = [];
                if (p.description && p.description.includes('Tailles disponibles:')) {
                    const sizePart = p.description.split('Tailles disponibles:')[1];
                    extractedSizes = sizePart.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
                }

                await prisma.product.create({
                    data: {
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        description: p.description,
                        price: p.price,
                        stock: p.stock,
                        images: p.images || [],
                        shopId: p.shopId,
                        categoryId: p.newCategoryId || p.categoryId,
                        originCountryId: countryMap[p.country] || null,
                        minOrderQuantity: p.min_order_quantity || 1,
                        sizes: extractedSizes,
                        createdAt: new Date(p.createdAt),
                        updatedAt: new Date(p.updatedAt),
                    }
                });
                successCount++;
            } catch (e: any) {
                // console.error(`❌ Erreur sur produit ${p.id}:`, e.message);
                errorCount++;
            }
        }));
        
        console.log(`⏳ Progress: ${successCount + errorCount} / ${products.length}...`);
    }

    console.log('\n--- RÉSUMÉ FINAL ---');
    console.log(`✅ Succès : ${successCount}`);
    console.log(`❌ Échecs : ${errorCount}`);
    console.log('--------------------');
}

main().catch(console.error).finally(() => { pool.end(); });
