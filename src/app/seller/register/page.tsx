import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import SellerRegisterForm from '@/components/seller/register/SellerRegisterForm'
import PendingStatusView from '@/components/seller/register/PendingStatusView'
import RejectedStatusView from '@/components/seller/register/RejectedStatusView'

export default async function SellerRegisterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirection vers le login avec le paramètre next
    redirect('/login?next=/seller/register')
  }

  // Vérifier si une boutique existe déjà pour cet utilisateur
  const shop = await prisma.shop.findUnique({
    where: { ownerId: user.id }
  })

  // Gestion du rendu selon le statut de la boutique
  if (shop) {
    if (shop.status === 'APPROVED') {
       // Si approuvé, on redirige vers le dashboard vendeur
       redirect('/dashboard')
    }
    
    if (shop.status === 'PENDING') {
       return (
         <div className="min-h-screen pt-32 pb-20 bg-slate-50/50 flex items-center justify-center">
            <div className="container mx-auto px-4">
               <PendingStatusView />
            </div>
         </div>
       )
    }

    if (shop.status === 'REJECTED') {
       return (
         <div className="min-h-screen pt-32 pb-20 bg-slate-50/50 flex items-center justify-center">
            <div className="container mx-auto px-4">
               <RejectedStatusView />
            </div>
         </div>
       )
    }
  }

  // Si pas de boutique, on montre le formulaire d'inscription
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <SellerRegisterForm />
      </div>
    </div>
  )
}
