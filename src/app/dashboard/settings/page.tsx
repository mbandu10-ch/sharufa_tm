import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from '@/components/dashboard/settings/ProfileForm'
import { AddressManager } from '@/components/dashboard/settings/AddressManager'
import { SecurityForm } from '@/components/dashboard/settings/SecurityForm'
import { Settings, User, MapPin, ShieldCheck } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch Profile with Addresses
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      addresses: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  return (
    <div className="space-y-10 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
              Paramètres
            </span>
         </div>
         <h1 className="text-5xl font-black font-outfit text-primary tracking-tighter leading-none">
            Gérer mon <span className="text-secondary italic">Compte</span>
         </h1>
         <p className="text-muted-foreground text-lg font-medium">Configurez vos préférences personnelles et de sécurité.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-10">
        <TabsList className="bg-slate-50 p-2 rounded-[28px] h-20 inline-flex items-center gap-3 border-2 border-slate-100 shadow-sm">
          <TabsTrigger 
            value="profile" 
            className="rounded-[20px] px-8 h-14 font-black text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <User size={18} /> Profil
          </TabsTrigger>
          <TabsTrigger 
            value="addresses" 
            className="rounded-[20px] px-8 h-14 font-black text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <MapPin size={18} /> Adresses
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="rounded-[20px] px-8 h-14 font-black text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <ShieldCheck size={18} /> Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <ProfileForm profile={profile} />
        </TabsContent>

        <TabsContent value="addresses" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <AddressManager addresses={profile?.addresses || []} />
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in slide-in-from-left-4 duration-500">
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
