import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from 'dotenv'

dotenv.config()

const prismaClientSingleton = () => {
    let connectionString = process.env.DATABASE_URL;
    
    if (connectionString && connectionString.includes('sslmode=')) {
        connectionString = connectionString.replace(/sslmode=[^&?]+/g, 'sslmode=no-verify');
    }

    const pool = new Pool({ 
        connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: {
            rejectUnauthorized: false,
        }
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

const prisma = prismaClientSingleton();

async function main() {
  try {
    const columns: any = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Category' AND column_name = 'parentId';
    `;
    console.log('Columns found:', columns);
  } catch (error: any) {
    console.error('Error checking columns:', error);
  } finally {
    await prisma.$disconnect()
  }
}

main()
