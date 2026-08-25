'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { PackageCheck, PenLine, X } from 'lucide-react'
import { InteractiveStarInput } from './InteractiveStarInput'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore, useOrderStore } from '@/store/global.store'
import type { Review } from '@/lib/defaultData'

interface CreateReviewFormProps {
  productId: number
  onReviewAdded: (newReview: Review) => void
}

export function CreateReviewForm({
  productId,
  onReviewAdded,
}: CreateReviewFormProps) {
  const { isLoggedIn, user } = useAuthStore()
  const { getUserProductOrderStatus, addOrder } = useOrderStore()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Check ownership and shipping status
  const orderInfo = user ? getUserProductOrderStatus(user.id, productId) : { isOwner: false, isShipped: false }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn || !user) {
      toast.error('Please log in to submit a review.')
      return
    }

    if (!orderInfo.isOwner || !orderInfo.isShipped) {
      toast.error('Only customers with shipped orders can review this product.')
      return
    }

    if (!comment.trim()) {
      toast.error('Please enter your review comment.')
      return
    }

    if (comment.trim().length < 5) {
      toast.error('Review comment must be at least 5 characters long.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const newReview: Review = {
        user: user.name,
        avatar: user.avatar,
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().split('T')[0],
      }

      onReviewAdded(newReview)
      setComment('')
      setRating(5)
      setIsSubmitting(false)
      setIsOpen(false)
      toast.success('Thank you! Your verified review has been published.')
    }, 500)
  }

  // State 1: User Not Logged In
  if (!isLoggedIn || !user) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold font-serif text-foreground">
              Purchased this item?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Log in to your account to review products you own once they have shipped.
            </p>
          </div>
          <Link href="/login">
            <Button size="sm" className="font-semibold text-xs">
              Log in to Review
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // State 2: User Logged In, but hasn't purchased or product is not shipped
  if (!orderInfo.isOwner || !orderInfo.isShipped) {
    return (
      <Card className="border-border bg-muted/60 shadow-sm">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-start gap-3.5 flex-wrap sm:flex-nowrap">
            <div className="size-9 rounded-full flex items-center justify-center shrink-0 bg-card border border-border text-muted-foreground">
              <PackageCheck className="size-5" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-xs font-semibold text-foreground">
                Verified Purchase Required
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {!orderInfo.isOwner
                  ? 'Only verified buyers who have ordered this product and had it shipped can write a review.'
                  : `Your order for this item is currently in "${orderInfo.status}" status. You can post your review as soon as the shipment is dispatched.`}
              </p>
            </div>

            {/* Simulation Button for Developer / User Testing */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                addOrder({
                  id: `ord-test-${Date.now()}`,
                  userId: user.id,
                  productId,
                  productName: 'Current Product',
                  orderStatus: 'shipped',
                  createdAt: new Date().toISOString().split('T')[0],
                })
                toast.success('Simulated: Product marked as purchased & shipped for your account!')
              }}
              className="text-xs h-8 border-primary/40 text-primary hover:bg-secondary shrink-0"
              title="Click to simulate verified shipped ownership for testing"
            >
              + Simulate Shipped Order
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // State 3: User Logged In + Verified Owner with Shipped Item
  return (
    <Card className="border-primary/40 bg-card shadow-sm ring-1 ring-primary/20">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-border">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {user.name}
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-primary font-medium">
                  Verified Shipped Owner ✓
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Share your verified experience with other buyers
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant={isOpen ? 'outline' : 'default'}
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs h-8 gap-1.5"
          >
            {isOpen ? (
              <>
                <X className="size-3.5" />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <PenLine className="size-3.5" />
                <span>Write a Review</span>
              </>
            )}
          </Button>
        </div>

        {isOpen && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2 pt-3 border-t border-border">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Overall Rating
              </label>
              <InteractiveStarInput rating={rating} onChange={setRating} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Your Review
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this object? How is the build quality, feel, and performance?"
                rows={3}
                maxLength={1000}
                required
                className="text-xs"
              />
              <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-0.5">
                <span>Keep your review focused and honest.</span>
                <span>{comment.length}/1000</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs h-8 font-semibold"
              >
                {isSubmitting ? 'Publishing...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
