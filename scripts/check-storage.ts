
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function checkBuckets() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  
  console.log('Checking buckets...')
  const { data: buckets, error } = await supabase.storage.listBuckets()
  
  if (error) {
    console.error('Error listing buckets:', error)
    return
  }

  console.log('Found buckets:', buckets.map(b => b.name))
  
  const required = ['shops', 'products', 'sourcing']
  for (const bucket of required) {
    if (!buckets.find(b => b.name === bucket)) {
      console.warn(`⚠️ Bucket "${bucket}" IS MISSING!`)
    } else {
      console.log(`✅ Bucket "${bucket}" exists.`)
    }
  }
}

checkBuckets()
