import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopCatalogView } from '../ShopCatalogView'

export const metadata: Metadata = {
  title: 'All Products — Forma Store',
  description: 'Explore our complete collection of curated timepieces and design objects.',
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground animate-pulse">Loading catalog…</div>}>
      <ShopCatalogView />
    </Suspense>
  )
}