'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { Plus, Minus, Heart, Trash2 } from 'lucide-react'
import { ProductDetail } from '@/lib/productData'
import { useCartStore, useWishlistStore } from '@/store/global.store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CartItemRowProps {
  product: ProductDetail
  quantity: number
}

export function CartItemRow({ product, quantity }: CartItemRowProps) {
  const { updateQuantity, remove } = useCartStore()
  const { add: addToWishlist, list: wishlist } = useWishlistStore()

  const effectivePrice = product.discountPrice ?? product.price
  const itemSubtotal = effectivePrice * quantity
  const isInWishlist = wishlist.includes(product.id)

  const handleIncrement = () => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1)
    } else {
      toast.info(`Maximum stock reached (${product.stock} available)`)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1)
    }
  }

  const handleRemove = () => {
    remove(product.id)
    toast.info(`${product.name} removed from bag`)
  }

  const handleMoveToWishlist = () => {
    if (!isInWishlist) {
      addToWishlist(product.id)
    }
    remove(product.id)
    toast.success(`Moved ${product.name} to wishlist`)
  }

  return (
    <article className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-b border-border transition-colors">
      {/* Left: Image & Info */}
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href={`/products/${product.id}`}
          className="relative block w-20 h-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted group"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </Link>

        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
            {product.brand ?? product.category}
          </span>
          <h3 className="text-sm font-medium font-serif leading-snug truncate text-foreground">
            <Link
              href={`/products/${product.id}`}
              className="hover:underline hover:text-primary transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-primary">
              ${effectivePrice.toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="line-through text-[11px] text-muted-foreground">
                ${product.price.toLocaleString()}
              </span>
            )}
            {product.stock <= 3 && (
              <Badge variant="accent" className="text-[10px] px-1.5 py-0">
                Only {product.stock} left
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Right: Quantity Stepper, Subtotal & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-input rounded-md bg-card shadow-sm overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="h-7 w-7 rounded-none hover:bg-muted text-foreground"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3" />
          </Button>
          <span className="w-8 text-center text-xs font-semibold select-none text-foreground">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleIncrement}
            disabled={quantity >= product.stock}
            className="h-7 w-7 rounded-none hover:bg-muted text-foreground"
            aria-label="Increase quantity"
          >
            <Plus className="size-3" />
          </Button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[70px]">
          <span className="text-sm font-semibold font-serif text-foreground">
            ${itemSubtotal.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleMoveToWishlist}
            className="text-muted-foreground hover:text-foreground"
            title="Move to Wishlist"
            aria-label="Move to Wishlist"
          >
            <Heart className={`size-4 ${isInWishlist ? "fill-destructive text-destructive" : ""}`} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Remove item"
            aria-label="Remove item"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}
