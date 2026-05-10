'use client'

import React, { useState, useRef } from 'react'
import { Camera, X, Plus, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LogisticsProofUploaderProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  maxFiles?: number
}

export function LogisticsProofUploader({
  files,
  onFilesChange,
  maxFiles = 5
}: LogisticsProofUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      if (files.length + newFiles.length > maxFiles) {
        alert(`Vous ne pouvez pas uploader plus de ${maxFiles} photos.`)
        return
      }
      onFilesChange([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
          <Camera size={14} className="text-secondary" /> Preuves Photo ({files.length}/{maxFiles})
        </label>
        <p className="text-[9px] font-bold text-muted-foreground uppercase italic">Obligatoire pour validation</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {files.map((file, idx) => (
          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 group">
            <img 
              src={URL.createObjectURL(file)} 
              alt={`Proof ${idx}`} 
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeFile(idx)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {files.length < maxFiles && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-secondary hover:text-secondary transition-all"
          >
            <Plus size={20} />
            <span className="text-[8px] font-black uppercase">Ajouter</span>
          </button>
        )}
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
        capture="environment" // Triggers camera on mobile
      />

      {files.length === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
           <ImageIcon className="text-amber-500" size={20} />
           <p className="text-[10px] font-bold text-amber-900 leading-tight">
             Cliquez sur le bouton pour prendre une photo ou choisir depuis votre galerie.
           </p>
        </div>
      )}
    </div>
  )
}
