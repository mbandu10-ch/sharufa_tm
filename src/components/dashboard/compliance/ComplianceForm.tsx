'use client'

import React, { useState } from 'react'
import { updateShopLegalProfile } from '@/app/seller/compliance-actions'
import { toast } from 'sonner'
import { Save, Building2, Landmark, Globe } from 'lucide-react'

interface ComplianceFormProps {
  shopId: string
  initialData: any
}

export function ComplianceForm({ shopId, initialData }: ComplianceFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    legalBusinessName: initialData.legalBusinessName || '',
    tradeLicenseNumber: initialData.tradeLicenseNumber || '',
    tradeLicenseCountry: initialData.tradeLicenseCountry || '',
    vatNumber: initialData.vatNumber || '',
    bankAccountName: initialData.bankAccountName || '',
    bankName: initialData.bankName || '',
    iban: initialData.iban || '',
    swiftCode: initialData.swiftCode || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await updateShopLegalProfile(shopId, formData)
    setLoading(false)

    if (result.success) {
      toast.success('Informations mises à jour avec succès.')
    } else {
      toast.error(result.error || 'Une erreur est survenue.')
    }
  }

  const inputClass = "w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all outline-none bg-slate-50/30 font-medium text-sm"
  const labelClass = "block text-[11px] font-black text-primary uppercase tracking-widest mb-2 px-1 opacity-70"

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Business Info */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-secondary">
          <Building2 size={18} />
          <h3 className="font-black text-xs uppercase tracking-widest">Informations Commerciales</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1 lg:col-span-2">
            <label className={labelClass}>Nom Légal de l'Entreprise</label>
            <input 
              type="text" 
              value={formData.legalBusinessName}
              onChange={e => setFormData({ ...formData, legalBusinessName: e.target.value })}
              placeholder="Ex: Sharufa Trading LLC"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Numéro de Licence</label>
            <input 
              type="text" 
              value={formData.tradeLicenseNumber}
              onChange={e => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
              placeholder="Ex: 12345678"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Pays de la Licence</label>
            <input 
              type="text" 
              value={formData.tradeLicenseCountry}
              onChange={e => setFormData({ ...formData, tradeLicenseCountry: e.target.value })}
              placeholder="Ex: Turquie, UAE..."
              className={inputClass}
            />
          </div>
          <div className="space-y-1 lg:col-span-2">
            <label className={labelClass}>Numéro TVA / VAT (Optionnel)</label>
            <input 
              type="text" 
              value={formData.vatNumber}
              onChange={e => setFormData({ ...formData, vatNumber: e.target.value })}
              placeholder="Ex: TR1234567890"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Bank Info */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-secondary">
          <Landmark size={18} />
          <h3 className="font-black text-xs uppercase tracking-widest">Coordonnées Bancaires (RIB)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Nom du Bénéficiaire</label>
            <input 
              type="text" 
              value={formData.bankAccountName}
              onChange={e => setFormData({ ...formData, bankAccountName: e.target.value })}
              placeholder="Nom exact figurant sur le RIB"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Nom de la Banque</label>
            <input 
              type="text" 
              value={formData.bankName}
              onChange={e => setFormData({ ...formData, bankName: e.target.value })}
              placeholder="Ex: Ziraat Bankasi, Emirates NBD..."
              className={inputClass}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className={labelClass}>IBAN</label>
            <input 
              type="text" 
              value={formData.iban}
              onChange={e => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
              placeholder="TR00 0000 0000 ..."
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Code SWIFT / BIC</label>
            <input 
              type="text" 
              value={formData.swiftCode}
              onChange={e => setFormData({ ...formData, swiftCode: e.target.value.toUpperCase() })}
              placeholder="Ex: ZIRTTR2A"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : (
            <>
              Sauvegarder les informations <Save size={20} className="text-secondary" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
