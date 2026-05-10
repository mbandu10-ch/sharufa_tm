import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const prismaClientSingleton = () => {
  let connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  
  if (connectionString && connectionString.includes('sslmode=')) {
    connectionString = connectionString.replace(/sslmode=[^&?]+/g, 'sslmode=no-verify')
  }

  const pool = new Pool({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    }
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const prisma = prismaClientSingleton()

async function main() {
  console.log('--- SECURITY AUDIT: RLS STATUS ---')

  const tables: any[] = await prisma.$queryRaw`
    SELECT 
      relname as table_name,
      relrowsecurity as rls_enabled,
      relforcrowsecurity as rls_forced
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    ORDER BY relname;
  `

  console.table(tables)

  const disabledRls = tables.filter(t => !t.rls_enabled)
  if (disabledRls.length > 0) {
    console.warn(`WARNING: RLS is disabled on ${disabledRls.length} tables:`)
    console.log(disabledRls.map(t => t.table_name).join(', '))
  } else {
    console.log('✅ RLS is enabled on all tables.')
  }

  console.log('\n--- SENSITIVE COLUMNS AUDIT ---')
  const sensitiveKeywords = ['iban', 'account', 'bank', 'law', 'legal', 'license', 'vat', 'ssn', 'password', 'key', 'phone', 'email', 'address', 'detail', 'note', 'budget', 'price', 'amount', 'net']
  
  const columns: any[] = await prisma.$queryRaw`
    SELECT 
      table_name, 
      column_name, 
      data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, column_name;
  `

  const flaggedColumns = columns.filter(c => 
    sensitiveKeywords.some(kw => c.column_name.toLowerCase().includes(kw))
  )

  console.log(`Found ${flaggedColumns.length} potentially sensitive columns.`)
  
  // Group by table
  const grouped = flaggedColumns.reduce((acc, col) => {
    if (!acc[col.table_name]) acc[col.table_name] = []
    acc[col.table_name].push(col.column_name)
    return acc
  }, {})

  console.log(JSON.stringify(grouped, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
