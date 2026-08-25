'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Compass,
  Search,
  ArrowRight,
  HelpCircle,
  Package,
  Home,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { PRODUCTS } from '@/lib/defaultData'

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  // Recommend 3 diverse curated objects
  const featuredSuggestions = PRODUCTS.slice(0, 3)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/')
    }
  }

  const handleCopyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto py-12 px-4 pb-20 flex flex-col gap-12">
      {/* Top 404 Hero Panel */}
      <Card className="border-border bg-card shadow-lg p-6 sm:p-10 text-center flex flex-col items-center gap-6 overflow-hidden relative">
        <div className="size-16 rounded-2xl bg-secondary text-primary flex items-center justify-center border border-primary/20 shadow-xs">
          <Compass className="size-8 stroke-[1.5]" />
        </div>

        <div className="flex flex-col items-center gap-2 max-w-xl">
          <Badge variant="secondary" className="gap-1.5 px-3 py-0.5 text-[11px] font-semibold text-primary border-primary/20 bg-secondary">
            <Sparkles className="size-3" />
            <span>HTTP 404 • Page Not Located</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight mt-1">
            This Object or Page Does Not Exist
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The link you followed may be mistyped, the archival object may have been retired, or the page has moved to a new destination.
          </p>
        </div>

        {/* Attempted URL Badge Box with Tooltip */}
        {pathname && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border border-border text-xs text-muted-foreground font-mono max-w-full">
            <span className="text-[11px] font-sans font-semibold uppercase text-foreground/70">Requested path:</span>
            <span className="text-primary truncate max-w-[240px] sm:max-w-md">{pathname}</span>
            <TooltipProvider delay={150}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="p-1 hover:text-foreground transition-colors cursor-pointer ml-1"
                      aria-label="Copy requested URL"
                    />
                  }
                >
                  {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[11px] py-0.5 px-2 font-sans font-normal">
                  {copied ? 'Copied to clipboard!' : 'Copy requested path'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Direct Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-md flex gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search catalogue (e.g. timepieces, ceramics)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs bg-muted/50 focus-visible:bg-card"
            />
          </div>
          <Button type="submit" className="h-10 px-4 text-xs font-semibold">
            Search
          </Button>
        </form>

        {/* Action Fast-Track Links */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
              <Home className="size-3.5 text-primary" />
              <span>Catalogue Home</span>
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
              <Package className="size-3.5 text-primary" />
              <span>Track Orders</span>
            </Button>
          </Link>
          <Link href="/faq">
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
              <HelpCircle className="size-3.5 text-primary" />
              <span>Help & FAQ</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Suggested Curated Objects Section */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-semibold text-foreground">
              Popular Curated Objects
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore pieces from our permanent collection
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {featuredSuggestions.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="group flex flex-col gap-3 p-3 rounded-xl bg-card border border-border hover:shadow-md transition-all"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.badge && (
                  <Badge className="absolute top-2 left-2 text-[10px] px-2 py-0.5 shadow-sm">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  {item.brand}
                </span>
                <h3 className="text-xs font-serif font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {item.name}
                </h3>
                <span className="text-xs font-bold text-primary mt-1">
                  ${item.price.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Concierge Assistance Card */}
      <Card className="border-border bg-muted/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Looking for a specific limited release?</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Our studio concierge can help track down archived references or answer custom inquiries.
          </p>
        </div>
        <Link href="/contact">
          <Button variant="outline" size="sm" className="text-xs h-8 shrink-0">
            Contact Concierge
          </Button>
        </Link>
      </Card>
    </div>
  )
}
