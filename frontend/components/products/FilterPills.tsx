'use client'

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface FilterTag {
  label: string
  remove: () => void
}

interface FilterPillsProps {
  filterTags: FilterTag[]
  clearAll: () => void
}

export function FilterPills({ filterTags, clearAll }: FilterPillsProps) {
  if (filterTags.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {filterTags.map((tag) => (
        <Badge
          key={tag.label}
          variant="secondary"
          className="text-[11px] gap-1.5 pl-2.5 pr-1.5 py-0.5 font-normal border-primary/20 text-foreground"
        >
          <span>{tag.label}</span>
          <button
            type="button"
            onClick={tag.remove}
            aria-label={`Remove filter ${tag.label}`}
            className="hover:text-destructive transition-colors cursor-pointer rounded-full p-0.5"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="text-[11px] text-muted-foreground hover:text-primary underline ml-1 cursor-pointer"
      >
        Clear all
      </button>
    </div>
  )
}