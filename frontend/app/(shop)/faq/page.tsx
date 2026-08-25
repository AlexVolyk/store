'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  HelpCircle,
  Mail,
  ChevronRight,
  X,
  Truck,
  RotateCcw,
  Watch,
  CreditCard,
  Coffee,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FAQ_ITEMS, FAQ_CATEGORIES } from '@/lib/defaultData'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <HelpCircle className="size-3" />,
  Shipping: <Truck className="size-3" />,
  Timepieces: <Watch className="size-3" />,
  Returns: <RotateCcw className="size-3" />,
  Payments: <CreditCard className="size-3" />,
  Living: <Coffee className="size-3" />,
}

export default function FAQPage() {
  const [selectedCat, setSelectedCat] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCat === 'All' || item.category === selectedCat
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-[960px] mx-auto pb-20 w-full flex flex-col gap-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">FAQ & Support</span>
      </nav>

      {/* Header */}
      <div className="text-center pt-2 max-w-xl mx-auto flex flex-col items-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs text-primary border-primary/20 bg-secondary">
          <HelpCircle className="size-3.5" />
          <span>Support & Knowledge Base</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-muted-foreground">
          Find instant answers regarding shipping, watch care, returns, and ordering.
        </p>

        {/* Live Search Bar */}
        <div className="relative w-full max-w-md mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search keywords (e.g. warranty, shipping, refund)…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 text-xs h-10 bg-card shadow-xs"
            aria-label="Search FAQ questions"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear FAQ search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCat === cat
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-card text-muted-foreground border border-border hover:text-foreground hover:bg-muted'
            }`}
          >
            {CATEGORY_ICONS[cat] || <HelpCircle className="size-3" />}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Accordion Questions List */}
      <div className="flex flex-col gap-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-2">
            <HelpCircle className="size-8 text-muted-foreground/40" />
            <p className="text-sm font-semibold text-foreground">No matching questions found</p>
            <p className="text-xs text-muted-foreground">
              Try searching with different terms or contact our studio concierge directly.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCat('All')
                setSearchQuery('')
              }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <Accordion className="gap-3">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                className="border border-border bg-card shadow-xs rounded-xl overflow-hidden px-4 sm:px-5"
              >
                <AccordionTrigger className="py-4 hover:no-underline cursor-pointer group">
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-semibold text-muted-foreground px-2 py-0.5 border-border shrink-0"
                    >
                      {faq.category}
                    </Badge>
                    <span className="text-xs sm:text-sm font-medium font-serif text-foreground group-hover:text-primary transition-colors text-left">
                      {faq.q}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pt-1 pb-4 border-t border-border/40">
                  <p className="mt-2">{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Bottom Contact Help Card */}
      <Card className="border-primary/20 bg-secondary/50 shadow-sm p-6 sm:p-8 mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-serif font-semibold text-foreground">
              Still have questions about your order?
            </h3>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              Our studio concierge team is available Monday through Friday (9 AM – 6 PM PST) to assist with product inquiries, watch servicing, and custom requests.
            </p>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <Link href="/shipping">
              <Button variant="outline" className="h-9 px-3.5 text-xs font-semibold">
                Shipping Details
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="h-9 px-4 text-xs font-semibold gap-2">
                <Mail className="size-3.5" />
                <span>Contact Concierge</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
