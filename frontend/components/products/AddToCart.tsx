'use client'

import { ShoppingBag, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AddToCartProps {
  handleAddCart: () => void
  added: boolean
  disabled?: boolean
}

export function AddToCart({ handleAddCart, added, disabled }: AddToCartProps) {
  return (
    <Button
      variant={added ? 'default' : 'outline'}
      size="sm"
      onClick={handleAddCart}
      disabled={disabled}
      className={`h-7 px-2.5 text-xs font-semibold gap-1.5 transition-all duration-200 ${
        added
          ? 'bg-primary text-primary-foreground'
          : 'border-primary/30 text-primary hover:bg-primary/10 hover:border-primary'
      }`}
      aria-label={added ? 'Added to bag' : 'Add to bag'}
    >
      {added ? (
        <>
          <Check className="size-3 stroke-[2.5]" />
          <span>Added</span>
        </>
      ) : (
        <>
          <ShoppingBag className="size-3" />
          <span>To Bag</span>
        </>
      )}
    </Button>
  )
}
