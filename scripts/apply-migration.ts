import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config()

async function main() {
    let connectionString = process.env.DATABASE_URL;
    
    if (connectionString && connectionString.includes('sslmode=')) {
        connectionString = connectionString.replace(/sslmode=[^&?]+/g, 'sslmode=no-verify');
    }

    const pool = new Pool({ 
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        }
    });

    try {
        console.log('Applying migration: Adding parentId to Category table...');
        await pool.query('ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "parentId" TEXT;');
        console.log('Success!');
    } catch (error: any) {
        console.error('Error applying migration:', error);
    } finally {
        await pool.end();
    }
}

main()
