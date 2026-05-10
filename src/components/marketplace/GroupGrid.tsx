'use client'

import React from 'react'
import Link from 'next/link'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { motion } from 'framer-motion'

export function GroupGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-outfit tracking-tighter text-primary">
            <span className="font-normal">Nos </span>
            <span className="font-black">catégories</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg">
            Une navigation intelligente pour trouver exactement ce dont vous avez besoin.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {NAVIGATION_GROUPS.map((group, index) => {
            const Icon = group.icon
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={`/marketplace?group=${group.id}`}
                  scroll={false}
                  className="group flex flex-col items-center justify-center p-8 bg-white rounded-[40px] border border-border/50 shadow-sm hover:shadow-2xl hover:border-secondary/50 transition-all duration-500 hover:-translate-y-2 text-center h-full"
                >
                  <div className="w-20 h-20 rounded-3xl bg-muted/20 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 mb-6 shadow-inner group-hover:scale-110">
                    <Icon size={32} strokeWidth={1.2} className="transition-transform duration-500 group-hover:rotate-3" />
                  </div>
                  <h3 className="font-outfit font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary group-hover:text-secondary transition-colors px-2 leading-tight">
                    {group.name}
                  </h3>
                  
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                      {group.items.length} sections
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
