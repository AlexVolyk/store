'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  totalPages: number
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const rawPage = Number(searchParams.get('page'))
  const page = !isNaN(rawPage) && rawPage >= 1 ? Math.min(rawPage, totalPages) : 1

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (pageNumber <= 1) {
      params.delete('page')
    } else {
      params.set('page', pageNumber.toString())
    }
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination Navigation" className="flex items-center justify-center gap-1.5 mt-10">
      {/* Previous Page */}
      <Link
        href={page <= 1 ? '#' : createPageURL(page - 1)}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'icon-sm' }),
          'h-8 w-8',
          page <= 1 && 'opacity-40 pointer-events-none'
        )}
        aria-label="Previous page"
        tabIndex={page <= 1 ? -1 : 0}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        const isCurrent = page === p
        return (
          <Link
            key={p}
            href={createPageURL(p)}
            className={cn(
              buttonVariants({
                variant: isCurrent ? 'default' : 'outline',
                size: 'icon-sm',
              }),
              'h-8 w-8 text-xs font-semibold'
            )}
            aria-label={`Page ${p}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      })}

      {/* Next Page */}
      <Link
        href={page >= totalPages ? '#' : createPageURL(page + 1)}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'icon-sm' }),
          'h-8 w-8',
          page >= totalPages && 'opacity-40 pointer-events-none'
        )}
        aria-label="Next page"
        tabIndex={page >= totalPages ? -1 : 0}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  )
}