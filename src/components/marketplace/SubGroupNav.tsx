'use client'

import React from 'react'
import Link from 'next/link'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface SubGroupNavProps {
  currentGroupId?: string
  currentItemId?: string
  query?: string
}

export function SubGroupNav({ currentGroupId, currentItemId, query }: SubGroupNavProps) {
  const group = NAVIGATION_GROUPS.find(g => g.id === currentGroupId)
  if (!group) return null

  const Icon = group.icon

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Group Header */}
      <div className="flex items-center gap-6 p-6 rounded-[32px] bg-background border border-border/50 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-full bg-secondary/5 -skew-x-12 transform translate-x-1/2 group-hover:scale-x-110 transition-transform origin-right" />
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-lg relative z-10 scale-100 group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <div className="relative z-10 flex-grow">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Navigation par catégorie</h2>
          <h1 className="text-3xl font-outfit font-black tracking-tight text-primary uppercase leading-none">
            {group.name}
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
          <Link href="/marketplace" className="hover:underline">Toutes les catégories</Link>
          <ChevronRight size={14} />
        </div>
      </div>

      {/* Sub-navigation Items */}
      <div className="flex flex-wrap gap-3">
        <Link 
          href={`/marketplace?group=${group.id}&view=products&q=${query || ''}`}
          className={cn(
            "rounded-full px-8 py-4 font-black uppercase text-[10px] tracking-widest transition-all border",
            !currentItemId 
              ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105" 
              : "bg-white text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-primary"
          )}
        >
          Tout Explorer
        </Link>
        
        {group.items.map((item) => (
          <Link 
            key={item.id}
            href={`/marketplace?group=${group.id}&item=${item.id}&view=products&q=${query || ''}`}
            className={cn(
              "rounded-full px-8 py-4 font-black uppercase text-[10px] tracking-widest transition-all border",
              currentItemId === item.id 
                ? "bg-secondary text-primary border-secondary shadow-xl shadow-secondary/20 scale-105" 
                : "bg-white text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-primary"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
