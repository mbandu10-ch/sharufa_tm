'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MarketplacePaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
}

export function MarketplacePagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage 
}: MarketplacePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  if (totalPages <= 1) return null

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/marketplace?${params.toString()}`)
  }

  const renderPageButtons = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('ellipsis-start')
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      
      if (currentPage < totalPages - 2) pages.push('ellipsis-end')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }

    return pages.map((page, idx) => {
      if (typeof page === 'string') {
        return (
          <div key={`${page}-${idx}`} className="px-1 sm:px-2">
            <MoreHorizontal size={16} className="text-muted-foreground" />
          </div>
        )
      }
      
      const isActive = currentPage === page
      
      // Hide some buttons on very small screens
      const isExtreme = page !== 1 && page !== totalPages && Math.abs(currentPage - Number(page)) > 0
      
      return (
        <Button
          key={page}
          variant={isActive ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(Number(page))}
          className={cn(
            "w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold transition-all",
            isActive 
              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" 
              : "border-border/50 hover:border-secondary hover:text-secondary text-primary",
            isExtreme && "hidden sm:flex"
          )}
        >
          {page}
        </Button>
      )
    })
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-16 pb-20">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-12 h-12 rounded-2xl border-border/50 hover:border-secondary hover:text-secondary disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={20} />
        </Button>
        
        <div className="flex items-center gap-2 mx-4">
          {renderPageButtons()}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-12 h-12 rounded-2xl border-border/50 hover:border-secondary hover:text-secondary disabled:opacity-30 transition-all"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
      
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
        Page <span className="text-primary">{currentPage}</span> sur <span className="text-primary">{totalPages}</span> 
        <span className="mx-2">•</span> 
        <span className="text-secondary">{totalItems}</span> produits au total
      </p>
    </div>
  )
}
