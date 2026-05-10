const { Client } = require('pg');
require('dotenv').config();

// Test Direct Host instead of pooler
const connectionString = "postgresql://postgres.jaahszatxsvrondptyeq:PcxXFBkovfnC5Yi5@db.jaahszatxsvrondptyeq.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

console.log('🔌 Testing direct connection to: db.jaahszatxsvrondptyeq.supabase.co...');

client.connect()
  .then(() => {
    console.log('✅ SUCCESS! Direct connection established.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED! Direct connection error:', err.message);
    process.exit(1);
  });
