'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from './StarRating'
import { AddToCart } from './AddToCart'
import { HeartToggleWishlist } from './HeartToggleWishlist'
import { Badge } from './Badge'
import { PriceCard } from './PriceCard'
import { useCartStore, useWishlistStore } from '@/store/global.store'
import { getDiscount } from '@/lib/getDiscount'
import type { Product } from '@/lib/defaultData'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const cart = useCartStore()
  const wish = useWishlistStore()

  const discount = getDiscount(product.originalPrice, product.price)
  const id = product.id
  const isInWishList = wish.list.includes(id)
  const isInCart = cart.list.includes(id)

  const handleAddCart = () => {
    if (!isInCart) {
      cart.add(id)
      setAdded(true)
      toast.success(`${product.name} added to bag!`)
      setTimeout(() => setAdded(false), 1400)
    }
  }

  const heartToggleWishlist = () => {
    if (isInWishList) {
      wish.remove(id)
      toast.info('Removed from wishlist')
    } else {
      wish.add(id)
      toast.success('Added to wishlist')
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 border-border bg-card flex flex-col">
      <div className="relative overflow-hidden aspect-[4/5] bg-muted">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <Badge badge={product.badge} discount={discount} />
        <HeartToggleWishlist
          heartToggleWishlist={heartToggleWishlist}
          isInWishList={isInWishList}
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-3.5 flex flex-col gap-2 flex-1 justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium font-serif leading-snug line-clamp-1">
            <Link
              href={`/products/${product.id}`}
              className="hover:underline text-foreground hover:text-primary transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <StarRating rating={product.rating} size={11} />
            <span className="text-[11px] text-muted-foreground">
              ({product.reviews.toLocaleString()})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 mt-auto">
          <PriceCard
            originalPrice={product.originalPrice}
            price={product.price}
          />
          <AddToCart
            added={added || isInCart}
            handleAddCart={handleAddCart}
          />
        </div>
      </CardContent>
    </Card>
  )
}
