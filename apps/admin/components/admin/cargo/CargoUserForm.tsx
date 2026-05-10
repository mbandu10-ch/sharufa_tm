'use client'

import React, { useState } from 'react'
import { createCargoUser } from '@/lib/actions/admin/cargos/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, UserPlus, Key } from 'lucide-react'
import { toast } from 'sonner'

interface Cargo {
  id: string
  name: string
}

export default function CargoUserForm({ cargos }: { cargos: Cargo[] }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    cargoId: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.cargoId) {
      toast.error("Veuillez sélectionner un hub cargo")
      return
    }

    setLoading(true)

    try {
      const result = await createCargoUser(formData)
      if (result.success) {
        toast.success("Utilisateur Cargo créé avec succès")
        setFormData({ email: '', password: '', cargoId: '' })
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[40px] -mr-10 -mt-10" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
          <UserPlus size={20} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-tight">Nouvel Utilisateur Cargo</h3>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email Professionnel</Label>
          <Input 
            id="email" 
            type="email"
            required 
            placeholder="partenaire@email.com"
            className="rounded-2xl border-white/10 bg-white/5 focus:ring-secondary h-12 text-white placeholder:text-white/20"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Mot de passe Temporaire</Label>
          <div className="relative">
            <Input 
              id="password" 
              type="text"
              placeholder="Laisser vide pour générer"
              className="rounded-2xl border-white/10 bg-white/5 focus:ring-secondary h-12 text-white placeholder:text-white/20 pl-10"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Key className="absolute left-3.5 top-3.5 text-white/20" size={16} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargoId" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Hub Assigné</Label>
          <select 
            id="cargoId"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 focus:ring-secondary h-12 text-white px-4 outline-none appearance-none cursor-pointer"
            value={formData.cargoId}
            onChange={(e) => setFormData({...formData, cargoId: e.target.value})}
          >
            <option value="" className="bg-slate-900">Sélectionner un Hub...</option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.id} className="bg-slate-900">
                {cargo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading || cargos.length === 0}
        className="w-full h-14 rounded-2xl bg-secondary text-primary font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-secondary/10 relative z-10"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Créer le Compte"}
      </Button>
      
      {cargos.length === 0 && (
        <p className="text-[10px] text-red-400 font-black uppercase tracking-widest text-center animate-pulse">
          Créez d'abord un Hub Cargo
        </p>
      )}
    </form>
  )
}
