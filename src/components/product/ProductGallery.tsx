'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use a default image if none provided
  const productImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=800']

  const next = () => setCurrentIndex((prev) => (prev + 1) % productImages.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + productImages.length) % productImages.length)

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-square rounded-[40px] overflow-hidden bg-white border border-border group shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image 
              src={productImages[currentIndex]} 
              alt={`${name} - Image ${currentIndex + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-contain" 
            />
          </motion.div>
        </AnimatePresence>

        {productImages.length > 1 && (
          <>
            <button 
              onClick={prev}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {productImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {productImages.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                currentIndex === idx ? 'border-secondary shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image 
                src={image} 
                alt={`${name} thumbnail ${idx}`} 
                fill
                sizes="96px"
                className="object-contain" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
