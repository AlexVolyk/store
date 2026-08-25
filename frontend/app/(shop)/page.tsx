import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopCatalogView } from './ShopCatalogView'

export const metadata: Metadata = {
  title: 'Catalog — Forma Store',
  description: 'Explore our curated catalog of precision mechanical watches, point-and-shoot film cameras, and minimalist home objects.',
}

function CatalogLoadingSkeleton() {
  return (
    <div className="flex gap-8 animate-pulse">
      <div className="w-56 shrink-0 hidden md:block">
        <div className="h-6 w-24 bg-muted rounded mb-6" />
        <div className="flex flex-col gap-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-24 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="flex-1">
        <div className="h-8 w-48 bg-muted rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<CatalogLoadingSkeleton />}>
      <ShopCatalogView />
    </Suspense>
  )
}
