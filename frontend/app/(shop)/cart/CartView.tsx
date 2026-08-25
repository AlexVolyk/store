'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { CartItemList } from './components/CartItemList'
import { CartSummary } from './components/CartSummary'
import { EmptyCart } from './components/EmptyCart'
import { useCartStore } from '@/store/global.store'
import { getProductById, type ProductDetail } from '@/lib/defaultData'

export function CartView() {
  const { items } = useCartStore()

  // Match cart items with full product details
  const itemsWithProducts = useMemo(() => {
    return items
      .map((item) => {
        const product = getProductById(item.productId)
        if (!product) return null
        return {
          product,
          quantity: item.quantity,
        }
      })
      .filter((item): item is { product: ProductDetail; quantity: number } => item !== null)
  }, [items])

  // Calculate aggregated items total
  const itemsPrice = useMemo(() => {
    return itemsWithProducts.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price
      return sum + price * item.quantity
    }, 0)
  }, [itemsWithProducts])

  const totalQuantity = useMemo(() => {
    return itemsWithProducts.reduce((sum, item) => sum + item.quantity, 0)
  }, [itemsWithProducts])

  if (itemsWithProducts.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="max-w-[1120px] mx-auto pb-16 w-full">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-7 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Shopping Bag</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: Cart Item Rows */}
        <div className="flex-1 w-full">
          <CartItemList itemsWithProducts={itemsWithProducts} />
        </div>

        {/* Right: Order Summary Sidebar */}
        <CartSummary
          itemsPrice={itemsPrice}
          totalQuantity={totalQuantity}
        />
      </div>
    </div>
  )
}
