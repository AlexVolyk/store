'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Lock, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCartStore, useOrderStore, useAuthStore } from '@/store/global.store'
import { getProductById } from '@/lib/defaultData'

export default function CheckoutPage() {
  const { items, reset: resetCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const { user } = useAuthStore()

  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : 'Alex',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : 'Volyk',
    email: user?.email || 'alex@example.com',
    address: user?.street || '123 Heritage Way',
    city: user?.city || 'San Francisco, CA',
    postalCode: user?.postalCode || '94103',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvv: '888',
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const itemsWithDetails = items
    .map((item) => {
      const p = getProductById(item.productId)
      return p ? { product: p, quantity: item.quantity } : null
    })
    .filter(Boolean) as Array<{ product: NonNullable<ReturnType<typeof getProductById>>; quantity: number }>

  const subtotal = itemsWithDetails.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price
    return sum + price * item.quantity
  }, 0)

  const shipping = subtotal >= 150 ? 0 : 15
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (itemsWithDetails.length === 0) {
      toast.error('Your shopping bag is empty.')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      // Create unified order containing all items in the purchase
      const orderItems = itemsWithDetails.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.discountPrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
        brand: item.product.brand,
      }))

      addOrder({
        id: `ord-${Date.now().toString().slice(-6)}`,
        userId: user?.id || 'guest',
        items: orderItems,
        totalAmount: total,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        orderStatus: 'shipped',
        createdAt: new Date().toISOString().split('T')[0],
      })

      resetCart()
      setIsProcessing(false)
      setIsCompleted(true)
      toast.success('Order placed successfully! Thank you.')
    }, 1200)
  }

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="size-20 rounded-full flex items-center justify-center mb-6 bg-secondary text-primary border border-primary/20 shadow-sm">
          <CheckCircle2 className="size-10 stroke-[1.8]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold font-serif text-foreground mb-2">
          Thank you for your order!
        </h1>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Your order has been confirmed and dispatched. We&apos;ve sent a detailed receipt and tracking confirmation to your email.
        </p>
        <div className="flex gap-3">
          <Link href="/orders">
            <Button variant="outline" className="text-xs h-9">
              View My Orders
            </Button>
          </Link>
          <Link href="/">
            <Button className="text-xs h-9 font-semibold">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (itemsWithDetails.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold font-serif text-foreground mb-2">
          Your bag is empty
        </h1>
        <p className="text-xs text-muted-foreground mb-6">
          Add some items before proceeding to checkout.
        </p>
        <Link href="/">
          <Button className="text-xs">Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1120px] mx-auto pb-16 w-full">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-semibold font-serif text-foreground leading-none">
          Checkout
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
          <Lock className="size-3.5 text-primary" />
          <span>Encrypted and secured 256-bit SSL transaction</span>
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Shipping & Payment Form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-serif">1. Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">First name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Last name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Email address</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Street address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Postal Code</label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-serif">2. Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Card number</label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  required
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Expires (MM/YY)</label>
                  <Input
                    value={formData.expDate}
                    onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                    required
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Security Code (CVV)</label>
                  <Input
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    required
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="border-border bg-card shadow-md">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-serif">Items in Order ({itemsWithDetails.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex flex-col gap-4">
              <div className="flex flex-col divide-y divide-border/60 max-h-64 overflow-y-auto pr-1">
                {itemsWithDetails.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between py-2.5 gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={product.images[0]} alt={product.name} className="size-10 rounded object-cover border border-border shrink-0 bg-muted" />
                      <div className="truncate">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground">Qty: {quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-primary shrink-0">
                      ${((product.discountPrice ?? product.price) * quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-primary font-semibold' : 'text-foreground'}>
                    {shipping === 0 ? 'FREE' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax</span>
                  <span className="text-foreground">${tax.toLocaleString()}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-foreground">Total Due</span>
                  <span className="font-bold font-serif text-lg text-primary">${total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-11 text-sm font-semibold shadow-sm mt-2"
              >
                {isProcessing ? 'Processing Payment…' : `Pay $${total.toLocaleString()}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}