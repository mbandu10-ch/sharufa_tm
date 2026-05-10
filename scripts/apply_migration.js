const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  const migrationPath = path.join(__dirname, '../supabase/migrations/rls_hardening.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  try {
    await client.connect();
    console.log('--- EXECUTING RLS HARDENING MIGRATION ---');
    
    await client.query(sql);
    
    console.log('✅ Migration applied successfully!');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
