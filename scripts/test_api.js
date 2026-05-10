const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testApi() {
  console.log('🧪 Testing Supabase REST API connection...');
  const { data, error } = await supabase.from('Category').select('count').limit(1);
  
  if (error) {
    console.error('❌ API Error:', error.message);
    process.exit(1);
  } else {
    console.log('✅ SUCCESS! API is reachable. Data:', data);
    process.exit(0);
  }
}

testApi();
