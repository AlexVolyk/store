interface PriceCardProps {
  originalPrice?: number
  price: number
}

export function PriceCard({ originalPrice, price }: PriceCardProps) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[17px] font-semibold font-serif text-primary leading-none">
        ${price.toLocaleString()}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-xs text-muted-foreground line-through">
          ${originalPrice.toLocaleString()}
        </span>
      )}
    </div>
  )
}