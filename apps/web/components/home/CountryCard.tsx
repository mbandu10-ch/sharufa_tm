'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CountryCardProps {
  country: {
    id: string
    name: string
    code: string
    image: string
    description: string
  }
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative h-[450px] rounded-[40px] overflow-hidden bg-muted shadow-lg border border-border"
    >
      <Image 
        src={country.image}
        alt={country.name}
        fill
        className="object-cover transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      <div className="absolute top-8 left-8">
        <div className="bg-secondary text-primary font-black px-4 py-1.5 rounded-full text-xs tracking-[0.2em] shadow-xl">
          {country.code}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8 right-8">
        <h3 className="text-3xl font-outfit font-bold text-white mb-3">
          {country.name}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-[280px]">
          {country.description}
        </p>
        
        <Link 
          href={`/marketplace?country=${country.code}`}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-bold rounded-full group/btn hover:bg-secondary transition-all"
        >
          Acheter depuis {country.name}
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
