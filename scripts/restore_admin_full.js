const { Client } = require('pg');
require('dotenv').config();

async function restoreAdmin() {
  const email = 'nsharufa@sharufa.com';
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('--- RESTORING ADMIN PRIVILEGES ---');

    // 1. Get the Supabase Auth ID
    console.log(`Searching for Auth ID for: ${email}`);
    const authRes = await client.query('SELECT id FROM auth.users WHERE email = $1', [email]);
    
    if (authRes.rows.length === 0) {
      console.error(`ERROR: No user found in Supabase Auth with email ${email}`);
      return;
    }

    const userId = authRes.rows[0].id;
    console.log(`Found Auth ID: ${userId}`);

    // 2. Insert or Update the Profile in the "public" schema
    console.log('Restoring Profile record with ADMIN role...');
    
    const insertQuery = `
      INSERT INTO "Profile" (id, email, role, "firstName", "lastName", "updatedAt", "createdAt", "vendorStatus")
      VALUES ($1, $2, 'ADMIN', 'Super', 'Admin', NOW(), NOW(), 'NONE')
      ON CONFLICT (id) 
      DO UPDATE SET role = 'ADMIN', email = $2, "updatedAt" = NOW()
    `;

    await client.query(insertQuery, [userId, email]);
    
    console.log('✅ SUCCESS: Admin privileges restored for nsharufa@sharufa.com');

  } catch (err) {
    console.error('CRITICAL ERROR:', err);
  } finally {
    await client.end();
  }
}

restoreAdmin();
