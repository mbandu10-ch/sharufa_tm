const { Client } = require('pg');
require('dotenv').config();

async function fixShopEnums() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: No connection string found in environment variables.');
    return;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('--- Database Connection Established ---');

    // 1. Diagnostics: Find affected shops (cast enum to text)
    const findRes = await client.query(`
      SELECT id, name, type::text FROM "Shop" 
      WHERE type::text IN ('RETAIL', 'WHOLESALE', 'retail', 'wholesale')
    `);

    if (findRes.rows.length === 0) {
      console.log('No shops found with legacy types (RETAIL/WHOLESALE).');
    } else {
      console.log(`Found ${findRes.rows.length} affected shops:`);
      console.table(findRes.rows);

      // 2. Perform Migration
      console.log('Migrating types...');
      
      const updateRetail = await client.query(`
        UPDATE "Shop" 
        SET type = 'GENERAL_STORE' 
        WHERE type::text IN ('RETAIL', 'retail')
        RETURNING id, name
      `);
      console.log(`Updated ${updateRetail.rowCount} RETAIL shops to GENERAL_STORE.`);

      const updateWholesale = await client.query(`
        UPDATE "Shop" 
        SET type = 'WHOLESALE_STORE' 
        WHERE type::text IN ('WHOLESALE', 'wholesale')
        RETURNING id, name
      `);
      console.log(`Updated ${updateWholesale.rowCount} WHOLESALE shops to WHOLESALE_STORE.`);
    }

    // 3. Fallback: Catch any other unknown types not in the valid list
    const validTypes = [
      'FASHION_STORE', 'BEAUTY_STORE', 'HOME_STORE', 'ELECTRONICS_STORE', 
      'VEHICLE_SHOWROOM', 'AUTO_PARTS_STORE', 'CONSTRUCTION_STORE', 
      'PACKAGING_STORE', 'FMCG_STORE', 'FOOD_STORE', 'INDUSTRIAL_STORE', 
      'KIDS_STORE', 'GENERAL_STORE', 'WHOLESALE_STORE'
    ];
    const validTypeString = validTypes.map(t => `'${t}'`).join(', ');

    const findAnyOther = await client.query(`
      SELECT id, name, type::text FROM "Shop" 
      WHERE type::text NOT IN (${validTypeString})
    `);

    if (findAnyOther.rows.length > 0) {
      console.warn(`CRITICAL: Found ${findAnyOther.rows.length} more invalid types:`);
      console.table(findAnyOther.rows);
      
      const updateOthers = await client.query(`
        UPDATE "Shop" 
        SET type = 'GENERAL_STORE' 
        WHERE type::text NOT IN (${validTypeString})
      `);
      console.log(`Fallback: Updated ${updateOthers.rowCount} other invalid types to GENERAL_STORE.`);
    } else {
      console.log('✅ No other invalid ShopType values found.');
    }

  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await client.end();
    console.log('--- Database Connection Closed ---');
  }
}

fixShopEnums();
