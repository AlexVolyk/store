'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface InteractiveStarInputProps {
  rating: number
  onChange: (r: number) => void
}

export function InteractiveStarInput({
  rating,
  onChange,
}: InteractiveStarInputProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const activeScore = hoverRating ?? rating
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeScore
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="p-1 cursor-pointer transition-transform hover:scale-125 duration-150"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`size-5 transition-colors ${
                  isFilled
                    ? 'fill-primary text-primary'
                    : 'fill-transparent text-muted-foreground/40 hover:text-primary/60'
                }`}
              />
            </button>
          )
        })}
      </div>
      {activeScore > 0 && (
        <span className="text-xs font-semibold text-primary transition-opacity duration-150">
          {labels[activeScore]} ({activeScore}/5)
        </span>
      )}
    </div>
  )
}
