const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.count();
  const shops = await prisma.shop.count();
  const countries = await prisma.country.findMany();
  console.log({ products, shops, countries });
}

main().catch(console.error).finally(() => prisma.$disconnect());
