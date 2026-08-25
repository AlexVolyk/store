'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Lock, RotateCcw, Sparkles, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface CartSummaryProps {
  itemsPrice: number
  totalQuantity: number
}

const FREE_SHIPPING_THRESHOLD = 150
const STANDARD_SHIPPING_FEE = 15

export function CartSummary({ itemsPrice }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [discountRate, setDiscountRate] = useState(0)

  const isFreeShipping = itemsPrice >= FREE_SHIPPING_THRESHOLD
  const shippingPrice = isFreeShipping || itemsPrice === 0 ? 0 : STANDARD_SHIPPING_FEE
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - itemsPrice)
  const shippingProgress = Math.min(100, Math.round((itemsPrice / FREE_SHIPPING_THRESHOLD) * 100))

  const discountAmount = Math.round(itemsPrice * discountRate)
  const subtotalAfterDiscount = itemsPrice - discountAmount
  const taxPrice = Math.round(subtotalAfterDiscount * 0.08)
  const totalPrice = subtotalAfterDiscount + shippingPrice + taxPrice

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    const code = promoCode.trim().toUpperCase()
    if (!code) return

    if (code === 'FORMA10' || code === 'WELCOME10') {
      setAppliedPromo(code)
      setDiscountRate(0.1) // 10%
      toast.success(`Promo code ${code} applied! 10% off`)
    } else if (code === 'FORMA20') {
      setAppliedPromo(code)
      setDiscountRate(0.2) // 20%
      toast.success(`Promo code ${code} applied! 20% off`)
    } else {
      toast.error('Invalid promo code. Try "FORMA10"')
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setDiscountRate(0)
    setPromoCode('')
    toast.info('Promo code removed')
  }

  return (
    <Card className="w-full lg:w-80 shrink-0 shadow-md border-border bg-card">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base font-semibold font-serif text-foreground">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex flex-col gap-5">
        {/* Free Shipping Progress */}
        <div className="p-3 rounded-lg bg-muted/60 border border-border/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className={isFreeShipping ? "font-semibold text-primary" : "text-foreground"}>
              {isFreeShipping ? (
                <span className="flex items-center gap-1">
                  <Sparkles className="size-3 text-primary" /> Free shipping unlocked!
                </span>
              ) : (
                <>
                  Add <strong className="text-primary font-semibold">${amountNeededForFreeShipping}</strong> for Free Shipping
                </>
              )}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {shippingProgress}%
            </span>
          </div>
          <Progress value={shippingProgress} className="h-1.5" />
        </div>

        {/* Promo Code Form */}
        <form onSubmit={handleApplyPromo} className="flex flex-col gap-2">
          <label htmlFor="cart-promo" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Promotional Code
          </label>
          {appliedPromo ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-primary/20 text-xs">
              <span>
                Code <strong>{appliedPromo}</strong> applied (−{discountRate * 100}%)
              </span>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="opacity-70 hover:opacity-100 cursor-pointer p-0.5"
                aria-label="Remove promo code"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                id="cart-promo"
                type="text"
                placeholder="e.g. FORMA10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="h-8 text-xs uppercase"
              />
              <Button type="submit" variant="outline" size="sm" className="h-8 text-xs px-3">
                Apply
              </Button>
            </div>
          )}
        </form>

        <Separator />

        {/* Line Items */}
        <div className="flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Items Subtotal</span>
            <span className="font-medium text-foreground">${itemsPrice.toLocaleString()}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-primary font-medium">
              <span>Discount ({discountRate * 100}%)</span>
              <span>−${discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className={`font-medium ${isFreeShipping ? "text-primary font-semibold" : "text-foreground"}`}>
              {isFreeShipping ? 'FREE' : `$${shippingPrice}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimated Tax (8%)</span>
            <span className="font-medium text-foreground">${taxPrice.toLocaleString()}</span>
          </div>

          <Separator className="my-1" />

          <div className="flex items-center justify-between text-base">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold font-serif text-lg text-primary">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout" className="w-full block">
          <Button className="w-full h-11 text-sm font-semibold shadow-sm">
            Proceed to Checkout
          </Button>
        </Link>

        {/* Trust Badges */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border/80 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="size-3.5 text-primary" />
            <span>Secure 256-bit SSL encrypted checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="size-3.5 text-primary" />
            <span>30-day effortless returns guarantee</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
