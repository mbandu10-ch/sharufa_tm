
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function createBuckets() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Service Role Key in .env')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const bucketsToCreate = ['shops', 'sourcing']

  for (const bucketName of bucketsToCreate) {
    console.log(`Creating bucket "${bucketName}"...`)
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Bucket "${bucketName}" already exists.`)
      } else {
        console.error(`❌ Error creating bucket "${bucketName}":`, error.message)
      }
    } else {
      console.log(`🚀 Bucket "${bucketName}" created successfully!`)
    }
  }
}

createBuckets()
