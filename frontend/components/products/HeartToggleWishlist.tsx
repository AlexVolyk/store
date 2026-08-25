'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'

interface HeartToggleWishlistProps {
  heartToggleWishlist: () => void
  isInWishList: boolean
}

export function HeartToggleWishlist({
  heartToggleWishlist,
  isInWishList,
}: HeartToggleWishlistProps) {
  return (
    <TooltipProvider delay={250}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              onClick={heartToggleWishlist}
              className="absolute top-2.5 right-2.5 rounded-full bg-card/90 backdrop-blur-sm shadow-sm border-border hover:bg-card hover:scale-110 active:scale-95 transition-all z-10"
              aria-label={isInWishList ? 'Remove from wishlist' : 'Add to wishlist'}
            />
          }
        >
          <Heart
            className={`size-3.5 transition-colors ${
              isInWishList
                ? 'fill-destructive text-destructive'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          />
        </TooltipTrigger>
        <TooltipContent side="left" className="text-[11px] py-1 px-2.5 font-medium shadow-sm">
          {isInWishList ? 'Saved in wishlist' : 'Add to wishlist'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}