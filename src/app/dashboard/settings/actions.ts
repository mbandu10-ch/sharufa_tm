'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: { firstName, lastName }
    })
    
    // Si nous ajoutons un champ phone au profil plus tard, il faudra l'ajouter ici
    // Pour l'instant on se contente de firstName et lastName

    revalidatePath('/dashboard/settings')
    return { success: true, message: 'Profil mis à jour avec succès' }
  } catch (error) {
    console.error('Update Profile Error:', error)
    return { error: 'Erreur lors de la mise à jour du profil' }
  }
}

export async function addAddress(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  const fullName = formData.get('fullName') as string
  const street = formData.get('street') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const postalCode = formData.get('postalCode') as string
  const country = formData.get('country') as string
  const phone = formData.get('phone') as string
  const details = formData.get('details') as string
  const isDefault = formData.get('isDefault') === 'on'

  try {
    // 1. Ensure profile exists (Self-healing if profile creation failed during signup)
    const profile = await prisma.profile.findUnique({
      where: { id: user.id }
    })

    if (!profile) {
      await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email!,
          firstName: user.user_metadata?.first_name || user.user_metadata?.firstName || '',
          lastName: user.user_metadata?.last_name || user.user_metadata?.lastName || '',
          role: 'CLIENT',
        }
      })
    }

    if (isDefault) {
      // Définir les autres adresses comme non par défaut
      await prisma.address.updateMany({
        where: { profileId: user.id },
        data: { isDefault: false }
      })
    }

    await prisma.address.create({
      data: {
        profileId: user.id,
        fullName,
        street,
        city,
        state: state || null,
        postalCode,
        country,
        phone,
        details,
        isDefault
      }
    })

    revalidatePath('/dashboard/settings')
    revalidatePath('/checkout')
    return { success: true, message: 'Adresse ajoutée avec succès' }
  } catch (error: any) {
    console.error('Add Address Error:', error)
    return { error: `Détail de l'erreur: ${error.message || 'Inconnue'}` }
  }
}




export async function deleteAddress(addressId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  try {
    await prisma.address.delete({
      where: { id: addressId, profileId: user.id }
    })

    revalidatePath('/dashboard/settings')
    revalidatePath('/checkout')
    return { success: true, message: 'Adresse supprimée' }
  } catch (error) {
    console.error('Delete Address Error:', error)
    return { error: 'Erreur lors de la suppression' }
  }
}

export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  try {
    await prisma.address.updateMany({
      where: { profileId: user.id },
      data: { isDefault: false }
    })

    await prisma.address.update({
      where: { id: addressId, profileId: user.id },
      data: { isDefault: true }
    })

    revalidatePath('/dashboard/settings')
    revalidatePath('/checkout')
    return { success: true, message: 'Adresse par défaut mise à jour' }
  } catch (error) {
    console.error('Set Default Address Error:', error)
    return { error: 'Erreur lors du changement d\'adresse par défaut' }
  }
}
