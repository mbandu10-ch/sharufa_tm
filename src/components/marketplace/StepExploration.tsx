'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export function StepExploration() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const groupSlug = searchParams.get('group')
  const itemSlug = searchParams.get('item')

  const currentGroup = NAVIGATION_GROUPS.find(g => g.id === groupSlug)

  const handleGroupSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('group', id)
    params.delete('item')
    params.delete('category')
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  const handleItemSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('item', id)
    params.delete('category')
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  const goBackToGroups = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('group')
    params.delete('item')
    params.delete('category')
    router.push(`/marketplace?${params.toString()}`, { scroll: false })
  }

  if (!groupSlug || (groupSlug && itemSlug)) return null

  return (
    <div className="space-y-12 mb-20">
      <motion.section 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-10"
      >
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-4 text-center md:text-left">
              <Badge className="bg-primary/10 text-primary border-none px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-black">
                Sourcing & Marketplace
              </Badge>
              <h2 className="text-4xl md:text-5xl font-outfit font-black tracking-tight text-primary leading-none">
                {currentGroup?.name} <br/>
                <span className="text-secondary italic">Affinez votre recherche</span>
              </h2>
            </div>
            <button 
                onClick={goBackToGroups}
                className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary hover:text-secondary transition-all bg-white px-8 py-4 rounded-full border border-border shadow-xl hover:shadow-secondary/20"
            >
                <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
                Changer d'univers
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentGroup?.items.map((item, idx) => (
              <motion.button 
                key={item.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleItemSelect(item.id)}
                className="group flex items-center justify-between p-8 bg-white rounded-[32px] border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-1 h-full bg-secondary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-secondary transition-colors relative z-10">
                  {item.name}
                </span>
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-secondary group-hover:text-primary transition-all relative z-10 shadow-sm">
                  <ChevronRight size={20} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>
    </div>
  )
}
