'use server'

import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function forceUpdatePassword(password: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error("Session expirée. Veuillez vous reconnecter.")
    }

    // 1. Mettre à jour le mot de passe dans Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: password
    })

    if (authError) throw authError

    // 2. Mettre à jour le profil pour désactiver le flag force reset
    await prisma.profile.update({
      where: { id: user.id },
      data: { mustChangePassword: false }
    })

    revalidatePath('/cargo', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Force Update Password Error:', error)
    return { error: error.message || "Erreur lors de la mise à jour du mot de passe." }
  }
}
