'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import {
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  MessageSquarePlus,
  ChevronRight,
} from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore, useOrderStore, useCartStore, type OrderStatus } from '@/store/global.store'

export default function OrdersPage() {
  const { user, isLoggedIn } = useAuthStore()
  const { orders } = useOrderStore()
  const { add: addToCart } = useCartStore()

  const userOrders = user ? orders.filter((o) => o.userId === user.id) : orders

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">
            <CheckCircle2 className="size-3" /> Delivered
          </Badge>
        )
      case 'shipped':
        return (
          <Badge variant="secondary" className="gap-1 text-primary border-primary/30 font-medium">
            <Truck className="size-3" /> Shipped
          </Badge>
        )
      case 'processing':
      case 'pending':
        return (
          <Badge variant="panel" className="gap-1 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium">
            <Clock className="size-3" /> Processing
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="gap-1 text-muted-foreground font-medium">
            <AlertCircle className="size-3" /> {status}
          </Badge>
        )
    }
  }

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0
      case 'processing':
        return 1
      case 'shipped':
        return 2
      case 'delivered':
        return 3
      default:
        return 1
    }
  }

  const handleBuyAgain = (productId: number, productName: string) => {
    addToCart(productId, 1)
    toast.success(`${productName} added to your shopping bag!`)
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="size-20 rounded-full flex items-center justify-center mb-6 bg-secondary text-primary border border-primary/20 shadow-sm">
          <Package className="size-9 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-semibold font-serif text-foreground mb-2">
          Track your orders
        </h1>
        <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
          Please sign in to view your order history, delivery milestones, and product warranty records.
        </p>
        <Link href="/login">
          <Button className="px-6 h-10 font-semibold shadow-sm text-xs">
            Sign In to View Orders
          </Button>
        </Link>
      </div>
    )
  }

  if (userOrders.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="size-20 rounded-full flex items-center justify-center mb-6 bg-secondary text-primary border border-primary/20 shadow-sm">
          <Package className="size-9 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-semibold font-serif text-foreground mb-2">
          No orders yet
        </h1>
        <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
          You haven&apos;t placed any orders yet. Discover our curated collection of mechanical watches and minimalist design.
        </p>
        <Link href="/">
          <Button className="gap-2 px-6 h-10 font-semibold shadow-sm text-xs">
            <span>Start Shopping</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    )
  }

  const totalSpent = userOrders.reduce((sum, o) => {
    if (o.totalAmount) return sum + o.totalAmount
    if (o.items && o.items.length > 0) {
      return sum + o.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
    }
    return sum
  }, 0)

  const totalItemsCount = userOrders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
    }
    return sum + 1
  }, 0)

  return (
    <div className="max-w-[1020px] mx-auto pb-16 w-full">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Order History</span>
      </nav>

      {/* Header & Metrics */}
      <div className="flex items-start justify-between mb-8 pb-4 border-b border-border flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold font-serif text-foreground leading-none">
            My Orders
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            Review recent purchases, itemized receipts, and shipment progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 text-xs gap-1.5 border-border bg-card">
            <Package className="size-3.5 text-primary" />
            <span>{userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'} ({totalItemsCount} items)</span>
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5 border-primary/20 text-primary font-semibold">
            <DollarSign className="size-3.5" />
            <span>${totalSpent.toLocaleString()} Total</span>
          </Badge>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {userOrders.map((order) => {
          const items = order.items && order.items.length > 0
            ? order.items
            : [
                {
                  productId: order.productId || 1,
                  productName: order.productName || 'Curated Object',
                  price: 120,
                  quantity: 1,
                  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
                  brand: 'Forma Collection',
                },
              ]

          const orderTotal = order.totalAmount ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const activeStep = getStatusStepIndex(order.orderStatus)
          const steps = ['Order Placed', 'Processing', 'Dispatched', 'Delivered']

          return (
            <Card key={order.id} className="shadow-md border-border bg-card overflow-hidden">
              {/* Order Top Bar with Metadata */}
              <CardHeader className="p-4 sm:p-5 bg-muted/30 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                      Order Placed
                    </span>
                    <span className="text-xs font-medium text-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="size-3 text-muted-foreground" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                      Total Due
                    </span>
                    <span className="text-xs font-bold font-serif text-primary mt-0.5 block">
                      ${orderTotal.toLocaleString()}
                    </span>
                  </div>

                  {order.shippingAddress && (
                    <div className="hidden md:block">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                        Ship To
                      </span>
                      <span className="text-xs text-foreground flex items-center gap-1 mt-0.5 truncate max-w-[180px]" title={`${order.shippingAddress.name}, ${order.shippingAddress.city}`}>
                        <MapPin className="size-3 text-muted-foreground shrink-0" />
                        {order.shippingAddress.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    #{order.id}
                  </span>
                  {getStatusBadge(order.orderStatus)}
                </div>
              </CardHeader>

              {/* Order Status Visual Progress Tracker */}
              <div className="px-4 sm:px-6 py-3.5 bg-muted/10 border-b border-border/60">
                <div className="flex items-center justify-between relative max-w-lg mx-auto">
                  {/* Progress background line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border -z-0" />
                  {/* Progress active line */}
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 -z-0"
                    style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                  />

                  {steps.map((label, idx) => {
                    const isDone = idx <= activeStep
                    const isCurrent = idx === activeStep

                    return (
                      <div key={label} className="flex flex-col items-center gap-1 z-10">
                        <div
                          className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                            isDone
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-muted text-muted-foreground border border-border'
                          } ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] font-medium hidden sm:inline ${
                            isDone ? 'text-foreground font-semibold' : 'text-muted-foreground'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Items Table / Rows */}
              <CardContent className="p-4 sm:p-5 divide-y divide-border/60">
                {items.map((item, idx) => (
                  <div
                    key={`${order.id}-item-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    {/* Item Image & Title */}
                    <div className="flex items-center gap-4 min-w-0">
                      {item.image && (
                        <Link
                          href={`/products/${item.productId}`}
                          className="relative block size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted group"
                        >
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="size-full object-cover transition-transform group-hover:scale-105"
                          />
                        </Link>
                      )}

                      <div className="flex flex-col gap-1 min-w-0">
                        {item.brand && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            {item.brand}
                          </span>
                        )}
                        <h3 className="text-sm font-semibold font-serif text-foreground truncate">
                          <Link
                            href={`/products/${item.productId}`}
                            className="hover:underline hover:text-primary transition-colors"
                          >
                            {item.productName}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span className="font-medium text-foreground">
                            ${item.price.toLocaleString()} each
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Item Total & Action Buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-muted-foreground block sm:hidden uppercase font-semibold">
                          Subtotal
                        </span>
                        <span className="text-sm font-bold font-serif text-foreground">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBuyAgain(item.productId, item.productName)}
                          className="text-xs h-8 gap-1.5 hover:border-primary/40 hover:bg-secondary"
                          title="Add item to shopping bag again"
                        >
                          <ShoppingBag className="size-3.5" />
                          <span>Buy Again</span>
                        </Button>

                        <Link href={`/products/${item.productId}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8 gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <span>View</span>
                            <ExternalLink className="size-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Order Footer with Shipping Address & Review CTA */}
              <CardFooter className="p-4 sm:p-5 bg-muted/20 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
                {order.shippingAddress ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span>
                      Delivery to <strong>{order.shippingAddress.name}</strong>, {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    <span>Standard Insured Parcel Delivery</span>
                  </div>
                )}

                {(order.orderStatus === 'shipped' || order.orderStatus === 'delivered') && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link href={`/products/${items[0]?.productId || 1}#customer-reviews-heading`}>
                      <Button
                        variant="link"
                        size="xs"
                        className="text-xs text-primary font-semibold hover:underline p-0 h-auto gap-1"
                      >
                        <MessageSquarePlus className="size-3.5" />
                        <span>Write a Verified Review</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}