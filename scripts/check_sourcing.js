const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.sourcingRequest.count();
    console.log('SourcingRequests count:', count);
    
    if (count > 0) {
      const sample = await prisma.sourcingRequest.findMany({ take: 3 });
      console.log('Samples:', JSON.stringify(sample, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
