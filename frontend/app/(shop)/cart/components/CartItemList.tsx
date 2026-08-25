'use client'

import { ProductDetail } from '@/lib/productData'
import { CartItemRow } from './CartItemRow'
import { useCartStore } from '@/store/global.store'
import { Button } from '@/components/ui/button'

interface CartItemListProps {
  itemsWithProducts: Array<{
    product: ProductDetail
    quantity: number
  }>
}

export function CartItemList({ itemsWithProducts }: CartItemListProps) {
  const { reset } = useCartStore()
  const totalCount = itemsWithProducts.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <section aria-label="Cart Items" className="flex flex-col">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-semibold font-serif text-foreground">
            Shopping Bag
          </h2>
          <span className="text-xs text-muted-foreground">
            ({totalCount} {totalCount === 1 ? 'item' : 'items'})
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7"
        >
          Clear Bag
        </Button>
      </div>

      {/* List */}
      <div className="flex flex-col divide-y divide-border/50">
        {itemsWithProducts.map(({ product, quantity }) => (
          <CartItemRow
            key={product.id}
            product={product}
            quantity={quantity}
          />
        ))}
      </div>
    </section>
  )
}
