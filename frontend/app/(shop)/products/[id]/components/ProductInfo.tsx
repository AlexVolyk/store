'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ShoppingBag, Check, Heart, Truck, RotateCcw } from 'lucide-react'
import { StarRating } from '@/components/products/StarRating'
import { useCartStore, useWishlistStore } from '@/store/global.store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { ProductDetail } from '@/lib/defaultData'

interface ProductInfoProps {
  product: ProductDetail
  averageRating: number
  totalReviews: number
}

export function ProductInfo({
  product,
  averageRating,
  totalReviews,
}: ProductInfoProps) {
  const [added, setAdded] = useState(false)
  const cart = useCartStore()
  const wish = useWishlistStore()

  const isInWishlist = wish.list.includes(product.id)
  const isInCart = cart.list.includes(product.id)

  const handleAddCart = () => {
    if (!isInCart) {
      cart.add(product.id)
      setAdded(true)
      toast.success(`${product.name} added to your cart!`)
      setTimeout(() => setAdded(false), 1400)
    }
  }

  const handleWishlist = () => {
    if (isInWishlist) {
      wish.remove(product.id)
      toast.info('Removed from wishlist')
    } else {
      wish.add(product.id)
      toast.success('Added to wishlist')
    }
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  return (
    <section aria-label="Product Information" className="flex-1 min-w-0 flex flex-col gap-5">
      {/* Brand + Category + Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.brand && (
          <Badge variant="panel" className="text-[10px] font-semibold uppercase tracking-wider">
            {product.brand}
          </Badge>
        )}
        <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
          {product.category}
        </Badge>
        {discount && (
          <Badge variant="destructive" className="text-[10px] font-bold uppercase tracking-wider">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Title & SKU */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold font-serif leading-tight text-foreground">
          {product.name}
        </h1>
        {product.sku && (
          <p className="text-xs text-muted-foreground mt-1">
            SKU: {product.sku}
          </p>
        )}
      </div>

      {/* Rating Row */}
      <div className="flex items-center gap-2">
        <StarRating rating={averageRating} size={14} />
        <span className="text-sm font-semibold text-foreground">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">
          ({totalReviews.toLocaleString()} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-bold font-serif text-primary">
          ${(product.discountPrice ?? product.price).toLocaleString()}
        </span>
        {product.discountPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              ${product.price.toLocaleString()}
            </span>
            <Badge variant="secondary" className="text-xs font-semibold text-primary">
              Save ${(product.price - product.discountPrice).toLocaleString()}
            </Badge>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[11px] font-normal text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-xs">
        <span
          className={`size-2 rounded-full ${
            product.stock > 5
              ? 'bg-emerald-500'
              : product.stock > 0
              ? 'bg-amber-500'
              : 'bg-destructive'
          }`}
        />
        <span className="text-muted-foreground">
          {product.stock > 5
            ? 'In stock & ready to ship'
            : product.stock > 0
            ? `Only ${product.stock} left in stock — order soon`
            : 'Currently out of stock'}
        </span>
      </div>

      <Separator />

      {/* CTA Row */}
      <div className="flex items-center gap-3">
        {/* Add to Cart */}
        <Button
          onClick={handleAddCart}
          disabled={product.stock === 0}
          variant="default"
          className="flex-1 h-11 text-sm font-semibold gap-2 shadow-sm"
          aria-label="Add to cart"
        >
          {added || isInCart ? (
            <>
              <Check className="size-4 stroke-[2.5]" />
              <span>{isInCart && !added ? 'In Bag' : 'Added to Bag'}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" />
              <span>Add to Bag</span>
            </>
          )}
        </Button>

        {/* Wishlist */}
        <Button
          onClick={handleWishlist}
          variant={isInWishlist ? 'secondary' : 'outline'}
          size="icon-lg"
          className="size-11 rounded-lg border-border shrink-0 hover:scale-105 transition-all"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`size-5 transition-colors ${
              isInWishlist ? 'fill-destructive text-destructive' : 'text-muted-foreground'
            }`}
          />
        </Button>
      </div>

      {/* Meta Features */}
      <div className="flex flex-col gap-2 pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-primary" />
          <span>Complimentary insured shipping on orders over $150</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="size-4 text-primary" />
          <span>30-day effortless return policy with full refund</span>
        </div>
      </div>
    </section>
  )
}
