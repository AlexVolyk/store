'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border pb-3.5 mb-3.5">
      <button
        type="button"
        className="w-full flex items-center justify-between py-1 text-left cursor-pointer group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      {open && <div className="pt-2 animate-in fade-in-50 duration-150">{children}</div>}
    </div>
  )
}
