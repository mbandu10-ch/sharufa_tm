import { prisma } from './src/lib/prisma'

async function main() {
  try {
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Address';
    `
    console.log('Columns in Address:', columns)
  } catch (error) {
    console.error('Error fetching columns:', error)
  }
}

main()
