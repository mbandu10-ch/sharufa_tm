'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, Zap, Percent } from 'lucide-react'

export function MarketplaceTicker() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    // Dans un vrai cas, on ferait un fetch ici. 
    // Pour l'instant, on simule des offres flash "moins chers"
    setProducts([
      { name: "Top Satin Chic", price: "5.99€" },
      { name: "Boucles d'oreilles Or", price: "1.99€" },
      { name: "Sac à main Mini", price: "8.50€" },
      { name: "T-shirt Oversize", price: "4.99€" },
      { name: "Lunettes de soleil Retro", price: "3.25€" },
      { name: "Baskets Run", price: "12.99€" },
    ])
  }, [])

  return (
    <div className="w-full bg-secondary text-primary overflow-hidden py-2 border-b border-primary/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-6">
            {products.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 group cursor-pointer">
                <Zap size={14} className="text-primary fill-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">{p.name}</span>
                <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[9px] font-black">{p.price}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest italic">OFFRES FLASH - JUSQU'À -70%</span>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
