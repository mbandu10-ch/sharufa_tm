import { PrismaClient } from '@prisma/client'
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import 'dotenv/config'

const prismaClientSingleton = () => {
  let connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (connectionString && connectionString.includes('sslmode=')) {
    connectionString = connectionString.replace(/sslmode=[^&?]+/g, 'sslmode=no-verify');
  }
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const prisma = prismaClientSingleton();

async function main() {
  const lastProfile = await prisma.profile.findFirst({
    orderBy: { createdAt: 'desc' }
  })
  console.log(JSON.stringify(lastProfile, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
