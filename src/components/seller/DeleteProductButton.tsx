'use client'

import { useState } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteProduct } from '@/app/seller/actions'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteProduct(productId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Le produit "${productName}" a été supprimé avec succès.`, {
          duration: 5000,
        })
        setOpen(false)
      }
    } catch (error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8 transition-colors"
            title="Supprimer le produit"
          />
        }
      >
        <Trash2 className="h-4 w-4" />
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
             <AlertTriangle size={24} />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-xl font-outfit font-black">Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Êtes-vous sûr de vouloir supprimer <span className="text-primary font-bold">&quot;{productName}&quot;</span> ? 
              <br />Cette action est irréversible et retirera le produit de la boutique.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 rounded-xl h-12 font-bold"
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-destructive/20"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              'Supprimer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
