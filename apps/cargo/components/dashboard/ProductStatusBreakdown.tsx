'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface ProductStatusBreakdownProps {
  approved: number
  pending: number
  rejected: number
}

export function ProductStatusBreakdown({ approved, pending, rejected }: ProductStatusBreakdownProps) {
  const total = approved + pending + rejected
  
  if (total === 0) return null

  const items = [
    { label: 'En ligne', count: approved, color: 'text-emerald-600', icon: CheckCircle2, bg: 'bg-emerald-50' },
    { label: 'En revue', count: pending, color: 'text-amber-600', icon: Clock, bg: 'bg-amber-50' },
    { label: 'À corriger', count: rejected, color: 'text-red-600', icon: AlertCircle, bg: 'bg-red-50' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-4">
      {items.map((item) => (
        <div 
          key={item.label}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:scale-105",
            item.count > 0 ? `${item.bg} border-transparent shadow-sm` : "opacity-40 grayscale border-slate-100"
          )}
        >
          <item.icon className={cn("w-4 h-4", item.color)} />
          <span className={cn("text-xs font-black uppercase tracking-widest", item.color)}>
            {item.count} {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
