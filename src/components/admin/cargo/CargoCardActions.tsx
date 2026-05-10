'use client'

import React, { useState } from 'react'
import { deleteCargoPartner, toggleCargoStatus } from '@/lib/actions/admin/cargos/actions'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/dialog'

export default function CargoCardActions({ id, isActive }: { id: string, isActive: boolean }) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteCargoPartner(id)
      if (result.success) {
        toast.success("Partenaire supprimé")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
      setIsOpen(false)
    }
  }

  const handleToggle = async () => {
    try {
      const result = await toggleCargoStatus(id, !isActive)
      if (result.success) {
        toast.success(`Hub ${!isActive ? 'activé' : 'désactivé'}`)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Erreur de mise à jour")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger
          render={(props) => (
            <Button 
              {...props}
              variant="ghost" 
              size="icon" 
              disabled={loading}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
            </Button>
          )}
        />
        <AlertDialogContent className="rounded-[40px] border-none p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-primary">Supprimer ce Partenaire ?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium py-4">
              Êtes-vous sûr de vouloir supprimer ce partenaire logistique ? 
              <br/><br/>
              <span className="text-red-600 font-bold block bg-red-50 p-4 rounded-2xl border border-red-100 italic text-sm">
                Cette action est irréversible. Toutes les données associées à ce hub seront définitivement supprimées.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel className="rounded-full px-8 py-6 h-auto border-2 border-slate-100 font-bold uppercase text-[10px] tracking-widest">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 h-auto font-black uppercase text-[10px] tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Confirmer la Suppression"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <button 
        onClick={handleToggle}
        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
      >
        {isActive ? 'Actif' : 'Inactif'}
      </button>
    </div>
  )
}
