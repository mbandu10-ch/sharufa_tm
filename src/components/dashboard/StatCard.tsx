'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  LucideIcon, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Store 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  iconName: 'package' | 'shopping-bag' | 'trending-up' | 'users' | 'store'
  description?: string
  trend?: {
    value: string
    positive: boolean
  }
  color?: 'primary' | 'secondary' | 'accent' | 'blue'
}

export function StatCard({ 
  title, 
  value, 
  iconName, 
  description, 
  trend,
  color = 'primary' 
}: StatCardProps) {
  const iconMap = {
    'package': Package,
    'shopping-bag': ShoppingBag,
    'trending-up': TrendingUp,
    'users': Users,
    'store': Store
  }
  
  const Icon = iconMap[iconName] || Package

  const iconColors = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    accent: 'bg-accent text-accent-foreground',
    blue: 'bg-blue-50 text-blue-600'
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 border-none shadow-sm bg-white rounded-[32px] overflow-hidden relative group">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className={cn("p-3 rounded-2xl transition-colors", iconColors[color])}>
                <Icon size={22} className="group-hover:scale-110 transition-transform" />
               </div>
               <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{title}</span>
            </div>
            
            <div className="flex flex-col gap-1">
               <h3 className="text-4xl font-black font-outfit text-primary tracking-tighter">
                 {value}
               </h3>
               {description && (
                  <p className="text-xs text-muted-foreground font-medium">{description}</p>
               )}
            </div>
          </div>
          
          {trend && (
            <div className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight",
              trend.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              {trend.positive ? '+' : '-'}{trend.value}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
