'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)

  const handlePrev = () => {
    setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const hasMultiple = images.length > 1

  return (
    <section aria-label="Product Images" className="flex gap-3 w-full min-w-0">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 shrink-0">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer p-0.5 bg-muted ${
              i === active
                ? 'border-primary opacity-100 shadow-sm'
                : 'border-border opacity-60 hover:opacity-100'
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <img
              src={src}
              alt={`${name} view ${i + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
          </button>
        ))}
      </div>

      {/* Main image container */}
      <div className="flex-1 overflow-hidden relative group rounded-xl bg-muted border border-border aspect-[4/5] max-h-[540px]">
        <img
          key={active}
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-300 animate-in fade-in-50"
        />

        {/* Navigation Arrows */}
        {hasMultiple && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/90 backdrop-blur-sm shadow-md opacity-85 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all"
              aria-label="Previous product image"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/90 backdrop-blur-sm shadow-md opacity-85 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all"
              aria-label="Next product image"
            >
              <ChevronRight className="size-4" />
            </Button>

            <Badge
              variant="secondary"
              className="absolute bottom-3 right-3 bg-black/60 text-white backdrop-blur-md border-0 text-[11px] font-medium"
            >
              {active + 1} / {images.length}
            </Badge>
          </>
        )}
      </div>
    </section>
  )
}
