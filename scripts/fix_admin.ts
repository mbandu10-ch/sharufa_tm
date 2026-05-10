import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAndFixAdmin() {
  const email = 'nsharufa@sharufa.com'
  console.log(`Checking profile for: ${email}`)
  
  const profile = await prisma.profile.findUnique({
    where: { email }
  })
  
  if (!profile) {
    console.log('Profile not found. The user needs to log in at least once to create their profile record after the reset.')
    return
  }
  
  console.log('Current profile:', JSON.stringify(profile, null, 2))
  
  if (profile.role !== 'ADMIN') {
    console.log('Updating role to ADMIN...')
    const updated = await prisma.profile.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    console.log('Update successful:', JSON.stringify(updated, null, 2))
  } else {
    console.log('User is already an ADMIN.')
  }
}

checkAndFixAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
