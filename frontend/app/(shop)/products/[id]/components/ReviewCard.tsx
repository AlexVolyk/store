import { StarRating } from '@/components/products/StarRating'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Review } from '@/lib/defaultData'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.user
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-border">
            {review.avatar && <AvatarImage src={review.avatar} alt={review.user} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-foreground truncate">
                {review.user}
              </p>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium text-primary">
                Verified Owner ✓
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {new Date(review.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          <StarRating rating={review.rating} size={11} />
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
      </CardContent>
    </Card>
  )
}
