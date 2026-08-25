import Link from 'next/link'
import { Truck, RotateCcw, Globe, PackageCheck, ChevronRight, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SHIPPING_TIERS, RETURN_STEPS } from '@/lib/defaultData'

export default function ShippingPage() {
  return (
    <div className="max-w-[1040px] mx-auto pb-20 w-full flex flex-col gap-12 sm:gap-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Shipping & Returns</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center pt-2 max-w-xl mx-auto flex flex-col items-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs text-primary border-primary/20 bg-secondary">
          <Truck className="size-3.5" />
          <span>Global Delivery & Guarantee</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
          Shipping & Returns Policy
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Transparent courier timelines, duties-paid international delivery, and a 30-day effortless return guarantee.
        </p>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">Free Shipping Over $150</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Applied automatically at checkout</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
              <RotateCcw className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">30-Day Return Window</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Effortless domestic returns</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
              <Globe className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">65+ Countries Served</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Duties and taxes prepaid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Timelines Table */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-serif font-semibold text-foreground">
            International Delivery Schedule
          </h2>
          <p className="text-xs text-muted-foreground">
            All shipments are insured for full replacement value and require signature confirmation upon arrival.
          </p>
        </div>

        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
          <div className="divide-y divide-border">
            {SHIPPING_TIERS.map((tier) => (
              <div key={tier.region} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xs font-semibold text-foreground">{tier.region}</h3>
                  <span className="text-[11px] text-muted-foreground">{tier.courier}</span>
                </div>
                <div className="flex flex-col sm:items-end gap-0.5 text-xs">
                  <span className="font-semibold text-primary">{tier.time}</span>
                  <span className="text-[11px] text-muted-foreground">{tier.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 30-Day Return Process */}
      <section className="flex flex-col gap-6 bg-muted/40 border border-border rounded-2xl p-6 sm:p-10">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Our Guarantee
          </span>
          <h2 className="text-xl font-serif font-semibold text-foreground">
            How Returns Work
          </h2>
          <p className="text-xs text-muted-foreground">
            We want you to feel complete peace of mind with every object in your home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RETURN_STEPS.map((step) => (
            <div key={step.step} className="p-5 rounded-xl bg-card border border-border flex flex-col gap-2 shadow-xs">
              <span className="text-lg font-serif font-bold text-primary">{step.step}</span>
              <h4 className="text-xs font-semibold text-foreground">{step.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zero Plastic Packaging Note */}
      <Card className="border-border bg-card shadow-xs p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="size-12 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
          <PackageCheck className="size-6" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-sm font-semibold font-serif text-foreground">Archival, Plastic-Free Packaging</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Every object is safely secured in custom-molded unbleached paper pulp trays, wrapped in organic Japanese washi tissue, and protected inside FSC-certified corrugated boxes.
          </p>
        </div>
        <Link href="/faq" className="shrink-0">
          <Button variant="outline" size="sm" className="text-xs h-9 gap-1.5">
            <HelpCircle className="size-3.5" />
            <span>More in FAQ</span>
          </Button>
        </Link>
      </Card>
    </div>
  )
}
