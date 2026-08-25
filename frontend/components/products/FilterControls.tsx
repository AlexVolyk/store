'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FilterSection } from './FilterSection'
import { FancyCheckbox } from './FancyCheckbox'
import { PriceSlider } from './PriceSlider'
import { StarRating } from './StarRating'
import { BRANDS, CATEGORIES, PRODUCTS, RATINGS } from '@/lib/defaultData'
import type { FilterTag } from './FilterPills'

interface FilterControlsProps {
  filterTags: FilterTag[]
  clearAll: () => void
  toggleList: (currentList: string[], key: string, value: string) => void
  priceMax: number
  updateFilters: (key: string, value: number | string | string[]) => void
  brands: string[]
  cats: string[]
  minRating: number
}

export function FilterControls({
  filterTags,
  clearAll,
  toggleList,
  priceMax,
  updateFilters,
  brands,
  cats,
  minRating,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold font-serif tracking-tight text-foreground">
          Filters
        </h2>
        {filterTags.length > 0 && (
          <Button
            variant="link"
            size="xs"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-primary px-0 h-auto gap-1"
          >
            <RotateCcw className="size-3" />
            <span>Clear all</span>
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => (
            <FancyCheckbox
              key={cat}
              checked={cats.includes(cat)}
              onChange={() => toggleList(cats, 'cats', cat)}
              label={cat}
              count={PRODUCTS.filter((p) => p.category === cat).length}
            />
          ))}
        </div>
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection title="Brand">
        <div className="flex flex-col gap-1.5">
          {BRANDS.map((brand) => (
            <FancyCheckbox
              key={brand}
              checked={brands.includes(brand)}
              onChange={() => toggleList(brands, 'brands', brand)}
              label={brand}
              count={PRODUCTS.filter((p) => p.brand === brand).length}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range Slider */}
      <FilterSection title="Price Range">
        <PriceSlider priceMax={priceMax} updateFilters={updateFilters} />
      </FilterSection>

      {/* Minimum Rating */}
      <FilterSection title="Min. Rating">
        <div className="flex flex-col gap-2">
          {RATINGS.map((r) => {
            const isSelected = minRating === r
            return (
              <Checkbox
                key={r}
                checked={isSelected}
                onCheckedChange={() => updateFilters('minRating', isSelected ? 0 : r)}
                label={
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={r} size={12} active={isSelected} />
                    <span className={`text-xs ${isSelected ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                      & up
                    </span>
                  </div>
                }
                badgeCount={PRODUCTS.filter((p) => p.rating >= r).length}
              />
            )
          })}
        </div>
      </FilterSection>
    </div>
  )
}