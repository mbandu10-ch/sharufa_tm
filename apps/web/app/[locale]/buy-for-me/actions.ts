'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/supabase/storage'

export async function createSourcingRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=Veuillez vous connecter pour soumettre une demande')
  }

  const title = formData.get('productName') as string || 'Produit inconnu'
  const description = formData.get('description') as string
  const targetCountry = formData.get('country') as string
  const referenceLink = formData.get('link') as string
  const budget = parseFloat(formData.get('budget') as string)
  const categoryId = formData.get('categoryId') as string
  const imageFile = formData.get('image') as File | null

  if (!description || !targetCountry) {
    return { error: 'La description et le pays sont requis' }
  }

  try {
    let imageUrl = null
    if (imageFile && imageFile.size > 0) {
      const { publicUrl } = await uploadFile(imageFile, 'sourcing', `${user.id}`)
      imageUrl = publicUrl
    }

    const request = await prisma.sourcingRequest.create({
      data: {
        clientId: user.id,
        title,
        description,
        referenceLink,
        imageUrl,
        targetCountry,
        budget: isNaN(budget) ? undefined : budget,
        categoryId: categoryId || undefined,
        status: 'NEW',
      }
    })

    // Créer un événement initial
    await prisma.sourcingEvent.create({
      data: {
        sourcingRequestId: request.id,
        action: "REQUEST_CREATED",
        message: "Demande de sourcing créée via le service Buy For Me.",
      }
    })

    revalidatePath('/dashboard/buyer/sourcing')
    redirect(`/dashboard/buyer/sourcing?success=Demande envoyée avec succès`)
  } catch (e) {
    // Si c'est un redirect de Next.js, on le laisse passer
    if (e instanceof Error && e.message === 'NEXT_REDIRECT') throw e;
    
    console.error('Error creating sourcing request:', e)
    return { error: 'Une erreur est survenue lors de la soumission' }
  }
}
