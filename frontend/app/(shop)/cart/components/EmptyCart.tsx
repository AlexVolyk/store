'use client'

import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyCart() {
  return (
    <section
      aria-label="Empty Shopping Bag"
      className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto"
    >
      <div className="size-20 rounded-full flex items-center justify-center mb-6 bg-secondary text-secondary-foreground border border-primary/20 shadow-sm">
        <ShoppingBag className="size-9 stroke-[1.5]" />
      </div>

      <h2 className="text-2xl font-semibold font-serif tracking-tight text-foreground mb-2">
        Your shopping bag is empty
      </h2>

      <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
        You haven&apos;t added any items to your bag yet. Explore our handcrafted mechanical timepieces and minimal home essentials.
      </p>

      <Link href="/">
        <Button className="gap-2 px-6 h-10 font-semibold shadow-sm">
          <span>Explore Catalog</span>
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </section>
  )
}
