import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  size?: number
  active?: boolean
  className?: string
}

export function StarRating({
  rating,
  size = 12,
  active,
  className,
}: StarRatingProps) {
  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((s) => {
        const isFilled = rating >= s
        const isHalf = !isFilled && rating >= s - 0.5

        const starColor =
          active !== undefined
            ? active
              ? isFilled
                ? 'fill-primary text-primary'
                : isHalf
                ? 'fill-primary/50 text-primary'
                : 'fill-transparent text-primary/30'
              : isFilled
              ? 'fill-muted-foreground/30 text-muted-foreground/60'
              : isHalf
              ? 'fill-muted-foreground/15 text-muted-foreground/60'
              : 'fill-transparent text-border'
            : isFilled
            ? 'fill-primary text-primary'
            : isHalf
            ? 'fill-primary/50 text-primary'
            : 'fill-transparent text-border'

        return (
          <Star
            key={s}
            style={{ width: size, height: size }}
            className={cn('transition-colors duration-150', starColor)}
          />
        )
      })}
    </div>
  )
}