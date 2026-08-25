'use client'

import { useState } from 'react'
import { Star, MessageSquare, X } from 'lucide-react'
import { StarRating } from '@/components/products/StarRating'
import { ReviewCard } from './ReviewCard'
import { CreateReviewForm } from './CreateReviewForm'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { Review } from '@/lib/defaultData'

interface RatingBarProps {
  star: number
  count: number
  total: number
  isSelected: boolean
  onToggle: () => void
}

function RatingBar({
  star,
  count,
  total,
  isSelected,
  onToggle,
}: RatingBarProps) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-2 text-xs p-1 rounded-md transition-colors text-left cursor-pointer ${
        isSelected ? 'bg-secondary' : 'hover:bg-muted/50'
      }`}
      aria-label={`Filter reviews by ${star} stars (${count} reviews)`}
    >
      <span className={`w-3 text-right ${isSelected ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
        {star}
      </span>
      <Star
        className={`size-3 shrink-0 transition-colors ${
          isSelected ? 'fill-primary text-primary' : 'fill-muted-foreground/40 text-muted-foreground/60'
        }`}
      />
      <Progress
        value={pct}
        className="h-1.5 flex-1"
        indicatorClassName={isSelected ? 'bg-primary' : 'bg-primary/70'}
      />
      <span className={`w-6 text-right text-[11px] ${isSelected ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
        {count}
      </span>
    </button>
  )
}

interface ProductReviewsProps {
  productId: number
  reviews: Review[]
  averageRating: number
  totalReviews: number
  ratingDist: { star: number; count: number }[]
  onReviewAdded: (newReview: Review) => void
}

export function ProductReviews({
  productId,
  reviews,
  averageRating,
  totalReviews,
  ratingDist,
  onReviewAdded,
}: ProductReviewsProps) {
  const [selectedStar, setSelectedStar] = useState<number | null>(null)

  const filteredReviews = selectedStar
    ? reviews.filter((r) => r.rating === selectedStar)
    : reviews

  return (
    <section aria-labelledby="customer-reviews-heading" className="mt-16">
      <Separator className="mb-10" />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2
            id="customer-reviews-heading"
            className="text-xl sm:text-2xl font-semibold font-serif leading-none text-foreground"
          >
            Customer Reviews
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Real feedback from verified purchasers
          </p>
        </div>

        {selectedStar && (
          <Badge
            variant="secondary"
            className="gap-1.5 px-2.5 py-1 text-xs font-medium text-primary border-primary/20"
          >
            <span>Showing {selectedStar}-star reviews only</span>
            <button
              type="button"
              onClick={() => setSelectedStar(null)}
              className="rounded-full hover:bg-primary/20 p-0.5 cursor-pointer opacity-70 hover:opacity-100"
              aria-label="Clear star filter"
            >
              <X className="size-3" />
            </button>
          </Badge>
        )}
      </div>

      {/* Create Review Form */}
      <div className="mb-8">
        <CreateReviewForm productId={productId} onReviewAdded={onReviewAdded} />
      </div>

      <div className="flex gap-10 flex-wrap md:flex-nowrap">
        {/* Rating Summary Breakdown */}
        <div className="shrink-0 flex flex-col gap-4 w-full md:w-56">
          <Card className="border-border bg-card shadow-sm text-center">
            <CardContent className="p-5 flex flex-col items-center gap-1">
              <span className="text-4xl font-bold font-serif leading-none text-foreground">
                {averageRating.toFixed(1)}
              </span>
              <StarRating rating={averageRating} size={14} />
              <span className="text-xs text-muted-foreground mt-1">
                {totalReviews.toLocaleString()} {totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-1.5">
            {ratingDist.map(({ star, count }) => (
              <RatingBar
                key={star}
                star={star}
                count={count}
                total={totalReviews}
                isSelected={selectedStar === star}
                onToggle={() => setSelectedStar(selectedStar === star ? null : star)}
              />
            ))}
          </div>
        </div>

        {/* Review Cards List */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((r, i) => <ReviewCard key={i} review={r} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground border border-dashed border-border rounded-xl bg-card">
              <MessageSquare className="size-8 stroke-[1.5]" />
              <p className="text-xs">
                {selectedStar
                  ? `No ${selectedStar}-star reviews found.`
                  : 'No reviews yet. Be the first verified owner to review this product!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
