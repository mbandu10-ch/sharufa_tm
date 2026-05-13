const { Client } = require('pg');
require('dotenv').config();

// Test Direct Host instead of pooler
const connectionString = process.env.DIRECT_URL;

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

console.log('🔌 Testing direct connection via DIRECT_URL...');

client.connect()
  .then(() => {
    console.log('✅ SUCCESS! Direct connection established.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED! Direct connection error:', err.message);
    process.exit(1);
  });
