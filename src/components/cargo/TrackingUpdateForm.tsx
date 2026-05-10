'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { TrackingStatus } from '@prisma/client'
import { addTrackingEvent } from '@/app/cargo/orders/actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, MapPin, Info } from 'lucide-react'

const formSchema = z.object({
  status: z.nativeEnum(TrackingStatus),
  location: z.string().min(2, "La localisation est requise"),
  note: z.string().optional(),
})

interface TrackingUpdateFormProps {
  orderId: string
}

export function TrackingUpdateForm({ orderId }: TrackingUpdateFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'RECEIVED_AT_WAREHOUSE',
      location: '',
      note: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const res = await addTrackingEvent({
      orderId,
      ...values,
    })

    if (res.success) {
      toast.success("Événement logistique enregistré avec succès ✅")
      reset({
        status: values.status,
        location: values.location,
        note: ""
      })
    } else {
      toast.error(res.error || "Une erreur est survenue")
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 italic">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Nouveau Statut */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Info size={14} className="text-secondary" /> Étape Logistique
          </Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="rounded-2xl border-2 border-slate-100 h-14 font-black uppercase text-[10px] tracking-widest italic bg-slate-50/50">
                  <SelectValue placeholder="Choisir l'étape actuelle" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl font-black uppercase text-[10px] tracking-widest">
                  {Object.values(TrackingStatus).map((status) => (
                    <SelectItem key={status} value={status} className="py-3 hover:bg-secondary/10 transition-colors">
                      {status.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
        </div>

        {/* Localisation */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <MapPin size={14} className="text-secondary" /> Localisation Actuelle
          </Label>
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <Input 
                placeholder="Ex: Hub Istanbul, Port de Dakar, Douane RDC..." 
                {...field} 
                className="rounded-2xl border-2 border-slate-100 h-14 font-bold text-sm italic bg-slate-50/50 px-6 focus:ring-secondary/50"
              />
            )}
          />
          {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
        </div>
      </div>

      {/* Note Complémentaire */}
      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Notes et Commentaires</Label>
        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <Textarea 
              placeholder="Détails supplémentaires : n° conteneur, retard éventuel, conditions météo..." 
              {...field} 
              className="rounded-[32px] border-2 border-slate-100 min-h-[120px] p-6 font-bold text-sm italic bg-slate-50/50 focus:ring-secondary/50 shadow-inner"
            />
          )}
        />
        <p className="text-[9px] font-medium opacity-50 uppercase tracking-widest pl-4">
          Ces informations seront visibles par le client final.
        </p>
        {errors.note && <p className="text-red-500 text-xs">{errors.note.message}</p>}
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-16 rounded-full bg-secondary text-primary hover:bg-secondary/90 font-black uppercase tracking-widest shadow-xl shadow-secondary/20 group"
        >
          {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          ) : (
              <>Enregistrer l&apos;événement <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
          )}
        </Button>
      </div>
    </form>
  )
}
