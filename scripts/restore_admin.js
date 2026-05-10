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
    console.log(`Checking profile for: ${email}`);
    
    // 1. Find the profile
    const findRes = await client.query('SELECT id, email, role FROM "Profile" WHERE email = $1', [email]);
    
    if (findRes.rows.length === 0) {
      console.log('Profile not found in Prisma database.');
      console.log('IMPORTANT: You must log in to the application first so the profile record is automatically re-created, then run this script again.');
      return;
    }

    const profile = findRes.rows[0];
    console.log('Current profile:', profile);

    if (profile.role !== 'ADMIN') {
      console.log('Updating role to ADMIN...');
      await client.query('UPDATE "Profile" SET role = \'ADMIN\' WHERE email = $1', [email]);
      console.log('SUCCESS: nsharufa@sharufa.com is now an ADMIN.');
    } else {
      console.log('User is already an ADMIN.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

restoreAdmin();
