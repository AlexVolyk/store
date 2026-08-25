import Link from 'next/link'
import { Scale, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TermsPage() {
  return (
    <div className="max-w-[880px] mx-auto pb-20 w-full flex flex-col gap-8 sm:gap-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Terms of Service</span>
      </nav>

      {/* Header */}
      <div className="text-center pt-2 max-w-xl mx-auto flex flex-col items-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs text-primary border-primary/20 bg-secondary">
          <Scale className="size-3.5" />
          <span>Legal Agreement</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground">
          Last revised: February 2026 • Terms governing the use of Forma Store and purchase agreements.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm p-6 sm:p-10 flex flex-col gap-8 text-xs text-muted-foreground leading-relaxed">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing, browsing, or purchasing objects through forma.store, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">2. Object Availability & Pricing</h2>
          <p>
            All timepieces and limited-edition objects are subject to artisanal stock limits. We reserve the right to limit order quantities per household. Prices are displayed in USD and are subject to change without prior notice prior to order confirmation.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">3. Warranty & Disclaimers</h2>
          <p>
            Forma mechanical watches include our 3-year international limited manufacturer warranty. This warranty does not cover normal wear and tear, cosmetic scratches, unauthorized tampering, or water damage caused by operation beyond specified depth ratings.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">4. Intellectual Property</h2>
          <p>
            All brand trademarks, design motifs, custom typography, product imagery, and curated editorial content on this site are the exclusive property of Forma Studio.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">5. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of California, United States, without regard to its conflict of law principles.
          </p>
        </section>
      </Card>
    </div>
  )
}
