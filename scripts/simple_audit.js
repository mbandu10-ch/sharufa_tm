const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('--- SECURITY AUDIT: RLS STATUS ---');

    const tablesRes = await client.query(`
      SELECT 
        relname as table_name,
        relrowsecurity as rls_enabled,
        relforcerowsecurity as rls_forced
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      ORDER BY relname;
    `);

    console.table(tablesRes.rows);

    const disabledRls = tablesRes.rows.filter(t => !t.rls_enabled);
    if (disabledRls.length > 0) {
      console.warn(`WARNING: RLS is disabled on ${disabledRls.length} tables:`);
      console.log(disabledRls.map(t => t.table_name).join(', '));
    } else {
      console.log('✅ RLS is enabled on all tables.');
    }

    console.log('\n--- SENSITIVE COLUMNS AUDIT ---');
    const sensitiveKeywords = ['iban', 'account', 'bank', 'law', 'legal', 'license', 'vat', 'ssn', 'password', 'key', 'phone', 'email', 'address', 'detail', 'note', 'budget', 'price', 'amount', 'net'];
    
    const columnsRes = await client.query(`
      SELECT 
        table_name, 
        column_name, 
        data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, column_name;
    `);

    const flaggedColumns = columnsRes.rows.filter(c => 
      sensitiveKeywords.some(kw => c.column_name.toLowerCase().includes(kw))
    );

    console.log(`Found ${flaggedColumns.length} potentially sensitive columns.`);
    
    const grouped = flaggedColumns.reduce((acc, col) => {
      if (!acc[col.table_name]) acc[col.table_name] = [];
      acc[col.table_name].push(col.column_name);
      return acc;
    }, {});

    console.log(JSON.stringify(grouped, null, 2));

  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await client.end();
  }
}

main();
