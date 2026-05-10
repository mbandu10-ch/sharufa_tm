const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
  console.log('🧐 Inspecting database tables...');
  
  // Try to see if Profile table exists and has data
  const { data: profiles, error: profileErr } = await supabase.from('Profile').select('*').limit(1);
  if (profileErr) {
    console.log('Profile table error:', profileErr.message);
  } else {
    console.log('Profile table found!');
    if (profiles.length > 0) console.log('First profile columns:', Object.keys(profiles[0]));
  }

  // Check Product table columns
  const { data: products, error: prodErr } = await supabase.from('Product').select('*').limit(1);
  if (prodErr) {
    console.log('Product table error:', prodErr.message);
  } else {
    console.log('Product table found!');
    if (products.length > 0) {
      console.log('Product columns:', Object.keys(products[0]));
    } else {
      console.log('Product table is empty.');
    }
  }

  // Check Category table
  const { data: cats } = await supabase.from('Category').select('name');
  console.log('Existing Categories:', cats?.map(c => c.name) || []);
}

inspect();
