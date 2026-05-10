'use server'

import { prisma } from '@/lib/prisma'

export async function getDomainCategories() {
  try {
    const domains = await prisma.category.findMany({
      where: { parentId: null },
      select: { id: true, name: true }
    })
    return { domains }
  } catch (error) {
    console.error('Error fetching domains:', error)
    return { error: 'Impossible de récupérer les catégories.' }
  }
}
