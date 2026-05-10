import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// FORCE: Bypass SSL verification globally for this process if it's production and we have the error
if (process.env.NODE_ENV === "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const prismaClientSingleton = () => {
  // Prioritize the pooler (DATABASE_URL) for main application logic
  // Use DIRECT_URL only as a fallback or for specific migration tasks
  let connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
  
  // Strip any sslmode parameters that might conflict with our explicit config
  if (connectionString && connectionString.includes('sslmode=')) {
    connectionString = connectionString.replace(/sslmode=[^&?]+/g, 'sslmode=no-verify');
  }

  // Use a lean pool to prevent saturating the database in HMR/Dev environments
  const pool = new Pool({ 
    connectionString,
    max: 5, // Reduced from 20 to 5 for better stability on shared DB instances
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: {
      rejectUnauthorized: false,
    }
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
