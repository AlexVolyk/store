'use client'

import { useMemo, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { X, Search, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { BRANDS, CATEGORIES, PAGE_SIZE, PRODUCTS, RATINGS } from '@/lib/defaultData'
import { ProductCard } from '@/components/products/ProductCard'
import { Pagination } from '@/components/products/Pagination'
import { SortSelect } from '@/components/products/SortSelect'
import { FilterControls } from '@/components/products/FilterControls'
import { FilterPills, type FilterTag } from '@/components/products/FilterPills'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'

export function ShopCatalogView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // 1. Safely Parse and Sanitize URL Search Parameters
  const search = searchParams.get('search')?.trim() || ''

  const cats = useMemo(() => {
    const rawCats = searchParams.getAll('cats')
    return rawCats
      .flatMap((c) => c.split(','))
      .map((c) => c.trim())
      .filter((c) => CATEGORIES.includes(c))
  }, [searchParams])

  const brands = useMemo(() => {
    const rawBrands = searchParams.getAll('brands')
    return rawBrands
      .flatMap((b) => b.split(','))
      .map((b) => b.trim())
      .filter((b) => BRANDS.includes(b))
  }, [searchParams])

  const minRating = useMemo(() => {
    const raw = searchParams.get('minRating')
    if (raw === null || raw === '') return 0
    const parsed = Number(raw)
    return !isNaN(parsed) && parsed >= 1 && parsed <= 5 ? parsed : 0
  }, [searchParams])

  const priceMax = useMemo(() => {
    const raw = searchParams.get('priceMax')
    if (raw === null || raw === '') return 1500
    const parsed = Number(raw)
    return !isNaN(parsed) && parsed >= 0 && parsed <= 1500 ? parsed : 1500
  }, [searchParams])

  const sortBy = useMemo(() => {
    const raw = searchParams.get('sortBy')
    return raw && ['price-asc', 'price-desc', 'rating'].includes(raw) ? raw : 'featured'
  }, [searchParams])

  // 2. Filter & Sort Catalog
  const filtered = useMemo(() => {
    let items = PRODUCTS.filter((p) => {
      if (search) {
        const query = search.toLowerCase()
        const nameMatch = p.name.toLowerCase().includes(query)
        const brandMatch = p.brand.toLowerCase().includes(query)
        const catMatch = p.category.toLowerCase().includes(query)
        if (!nameMatch && !brandMatch && !catMatch) return false
      }
      if (cats.length > 0 && !cats.includes(p.category)) return false
      if (brands.length > 0 && !brands.includes(p.brand)) return false
      if (p.rating < minRating) return false
      if (p.price > priceMax) return false
      return true
    })

    if (sortBy === 'price-asc') items = [...items].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') items = [...items].sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') items = [...items].sort((a, b) => b.rating - a.rating)
    return items
  }, [search, cats, brands, minRating, priceMax, sortBy])

  // 3. Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rawPage = searchParams.get('page')
  const page = useMemo(() => {
    if (rawPage === null || rawPage === '') return 1
    const parsed = Number(rawPage)
    return !isNaN(parsed) && parsed >= 1 ? Math.min(parsed, totalPages) : 1
  }, [rawPage, totalPages])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 4. Filter Handlers
  const updateFilters = (key: string, value: string[] | string | number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (key !== 'page') {
      params.delete('page')
    }

    if (Array.isArray(value)) {
      params.delete(key)
      value.forEach((v) => params.append(key, v))
    } else if (
      value === null ||
      value === '' ||
      value === 0 ||
      (key === 'priceMax' && Number(value) >= 1500) ||
      (key === 'sortBy' && value === 'featured') ||
      (key === 'page' && Number(value) <= 1)
    ) {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }

    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }

  const toggleList = (list: string[], key: string, val: string) => {
    const newList = list.includes(val) ? list.filter((v) => v !== val) : [...list, val]
    updateFilters(key, newList)
  }

  const clearAll = () => {
    router.push(pathname, { scroll: false })
  }

  // 5. Active Filter Tags
  const filterTags: FilterTag[] = [
    ...(search ? [{ label: `Search: "${search}"`, remove: () => updateFilters('search', '') }] : []),
    ...cats.map((c) => ({ label: `Category: ${c}`, remove: () => toggleList(cats, 'cats', c) })),
    ...brands.map((b) => ({ label: `Brand: ${b}`, remove: () => toggleList(brands, 'brands', b) })),
    ...(minRating > 0 ? [{ label: `${minRating}★ & up`, remove: () => updateFilters('minRating', 0) }] : []),
    ...(priceMax < 1500 ? [{ label: `Up to $${priceMax}`, remove: () => updateFilters('priceMax', 1500) }] : []),
  ]

  return (
    <div className="flex gap-8 flex-col md:flex-row pb-12">
      {/* ── Desktop Sidebar Filters (≥ 768px) ── */}
      <aside className="w-56 shrink-0 hidden md:block" aria-label="Filters Sidebar">
        <div className="sticky top-24">
          <FilterControls
            filterTags={filterTags}
            clearAll={clearAll}
            toggleList={toggleList}
            priceMax={priceMax}
            updateFilters={updateFilters}
            brands={brands}
            cats={cats}
            minRating={minRating}
          />
        </div>
      </aside>

      {/* ── Mobile Filter Drawer (< 768px) ── */}
      <Drawer
        open={isMobileFilterOpen}
        onOpenChange={setIsMobileFilterOpen}
        swipeDirection="right"
      >
        <DrawerContent className="max-w-[320px] h-full bg-card border-l border-border p-0 flex flex-col">
          {/* Drawer Header */}
          <DrawerHeader className="h-16 px-5 border-b border-border flex flex-row items-center justify-between shrink-0 bg-card">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <DrawerTitle className="text-base font-semibold font-serif text-foreground">
                Filters {filterTags.length > 0 && `(${filterTags.length})`}
              </DrawerTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsMobileFilterOpen(false)}
              aria-label="Close filter drawer"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </Button>
          </DrawerHeader>

          {/* Scrollable Filters Content */}
          <div className="flex-1 overflow-y-auto p-5 bg-card">
            <FilterControls
              filterTags={filterTags}
              clearAll={clearAll}
              toggleList={toggleList}
              priceMax={priceMax}
              updateFilters={updateFilters}
              brands={brands}
              cats={cats}
              minRating={minRating}
            />
          </div>

          {/* Drawer Footer */}
          <DrawerFooter className="p-4 border-t border-border bg-muted/40 shrink-0">
            <Button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full h-10 font-semibold text-xs justify-center gap-2"
            >
              <span>Show {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ── Main Catalog Grid Area ── */}
      <section aria-label="Product Catalog" className="flex-1 min-w-0">
        {/* Header & Sort / Mobile Filter Toolbar */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold font-serif tracking-tight text-foreground leading-none">
              {search ? `Search results for "${search}"` : 'All Products'}
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile Filter Trigger Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden text-xs h-8 gap-2 border-border bg-card shadow-sm hover:bg-muted"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="size-3.5 text-primary" />
              <span>Filters</span>
              {filterTags.length > 0 && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0 min-w-4 h-4 rounded-full">
                  {filterTags.length}
                </Badge>
              )}
            </Button>

            <SortSelect updateFilters={updateFilters} value={sortBy} />
          </div>
        </div>

        {/* Active Filter Pills */}
        <div className="mb-5">
          <FilterPills filterTags={filterTags} clearAll={clearAll} />
        </div>

        {/* Products Grid */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center border border-dashed border-border rounded-xl bg-card">
            <Search className="size-10 text-muted-foreground/50 stroke-[1.5]" />
            <p className="text-sm font-medium text-foreground">
              No products match your filters.
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Try adjusting your filters, price range, or search keyword.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="mt-2 text-xs"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination totalPages={totalPages} />
      </section>
    </div>
  )
}
