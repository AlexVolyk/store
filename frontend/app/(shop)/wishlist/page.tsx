'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { Heart, ArrowRight, ChevronRight, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/store/global.store'
import { PRODUCTS } from '@/lib/defaultData'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

export default function WishlistPage() {
  const { list, reset } = useWishlistStore()
  const wishlistProducts = PRODUCTS.filter((p) => list.includes(p.id))

  const handleClearWishlist = () => {
    reset()
    toast.success('Wishlist cleared successfully.')
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="size-20 rounded-full flex items-center justify-center mb-6 bg-secondary text-primary border border-primary/20 shadow-sm">
          <Heart className="size-9 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-semibold font-serif text-foreground mb-2">
          Your wishlist is empty
        </h1>
        <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
          Save your favorite timepieces and minimal home essentials to track their availability or purchase later.
        </p>
        <Link href="/">
          <Button className="gap-2 px-6 h-10 font-semibold shadow-sm text-xs">
            <span>Explore Catalog</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-16 w-full">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Wishlist</span>
      </nav>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold font-serif text-foreground leading-none">
            Saved Items
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {/* Clear Wishlist with AlertDialog Confirmation */}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>Clear Wishlist</span>
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Wishlist?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'item' : 'items'} from your wishlist. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearWishlist}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}