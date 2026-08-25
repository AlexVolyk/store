'use client'

import { Select } from '@/components/ui/select'
import { sortOptions } from '@/lib/defaultData'

interface SortSelectProps {
  value: string
  updateFilters: (sortBy: string, value: string) => void
}

export function SortSelect({ value, updateFilters }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="way-of-sort" className="text-xs text-muted-foreground font-medium">
        Sort
      </label>
      <Select
        id="way-of-sort"
        name="way-of-sort"
        value={value}
        onChange={(e) => updateFilters('sortBy', e.target.value)}
        className="h-8 text-xs bg-card min-w-[130px]"
      >
        {sortOptions.map((i) => (
          <option key={i.value} value={i.value}>
            {i.text}
          </option>
        ))}
      </Select>
    </div>
  )
}