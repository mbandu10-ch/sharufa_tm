import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function diagnoseEnums() {
  console.log('--- Checking for invalid ShopType values ---')
  
  // Custom query to bypass Prisma's enum validation during diagnostic
  const invalidShops = await prisma.$queryRaw`
    SELECT id, name, type FROM "Shop" 
    WHERE type NOT IN (
      'FASHION_STORE', 'BEAUTY_STORE', 'HOME_STORE', 
      'ELECTRONICS_STORE', 'VEHICLE_SHOWROOM', 'AUTO_PARTS_STORE', 
      'CONSTRUCTION_STORE', 'PACKAGING_STORE', 'FMCG_STORE', 
      'FOOD_STORE', 'INDUSTRIAL_STORE', 'KIDS_STORE', 
      'GENERAL_STORE', 'WHOLESALE_STORE'
    )
  `
  
  console.log('Affected shops:', JSON.stringify(invalidShops, null, 2))
}

diagnoseEnums()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
