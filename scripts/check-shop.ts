
import { prisma } from '../src/lib/prisma'

async function main() {
  const shop = await prisma.shop.findFirst({
    where: {
      OR: [
        { name: { contains: 'CHRISMAY', mode: 'insensitive' } },
        { slug: { contains: 'chrismay', mode: 'insensitive' } }
      ]
    }
  })

  if (shop) {
    console.log('SHOP_FOUND:', JSON.stringify(shop, null, 2))
  } else {
    console.log('SHOP_NOT_FOUND')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
