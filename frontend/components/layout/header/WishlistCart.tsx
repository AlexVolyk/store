'use client'

import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store/global.store'

export function WishlistCart() {
  const wishlistCount = useWishlistStore((state) => state.list.length)
  const cartCount = useCartStore((state) => state.list.length)

  return (
    <div className="hidden sm:flex items-center gap-0.5 sm:gap-1">
      {/* Wishlist Icon Button */}
      <Link
        href="/wishlist"
        className="relative p-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
        aria-label={`Wishlist (${wishlistCount} items)`}
      >
        <Heart
          className={`size-4 transition-colors ${
            wishlistCount > 0
              ? 'text-destructive fill-destructive'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        />
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground shadow-sm">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart Icon Button */}
      <Link
        href="/cart"
        className="relative p-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
        aria-label={`Cart (${cartCount} items)`}
      >
        <ShoppingBag className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center text-[9px] font-bold rounded-full bg-primary text-primary-foreground shadow-sm">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  )
}