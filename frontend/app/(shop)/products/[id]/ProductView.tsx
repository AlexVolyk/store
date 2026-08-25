'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductGallery } from './components/ProductGallery'
import { ProductInfo } from './components/ProductInfo'
import { ProductReviews } from './components/ProductReviews'
import type { ProductDetail, Review } from '@/lib/defaultData'

interface ProductViewProps {
  product: ProductDetail
}

export function ProductView({ product }: ProductViewProps) {
  const [reviews, setReviews] = useState<Review[]>(product.reviews)

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev])
  }

  // Dynamic rating stats based on current reviews list
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : product.averageRating

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="max-w-[1080px] mx-auto pb-16 w-full">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-7 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <Link href={`/?cats=${encodeURIComponent(product.category)}`} className="hover:text-foreground transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Overview Section */}
      <section aria-label="Product Overview" className="flex gap-10 flex-wrap md:flex-nowrap items-start">
        {/* Left — Image Gallery */}
        <div className="w-full md:w-[45%] shrink-0">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Right — Product Buy Box & Information */}
        <ProductInfo
          product={product}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      </section>

      {/* Reviews & Community Section */}
      <ProductReviews
        productId={product.id}
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
        ratingDist={ratingDist}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  )
}
