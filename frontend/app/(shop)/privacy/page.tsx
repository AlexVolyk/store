import Link from 'next/link'
import { ShieldCheck, Lock, ChevronRight, Eye, Database, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PrivacyPage() {
  return (
    <div className="max-w-[880px] mx-auto pb-20 w-full flex flex-col gap-8 sm:gap-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="text-center pt-2 max-w-xl mx-auto flex flex-col items-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs text-primary border-primary/20 bg-secondary">
          <ShieldCheck className="size-3.5" />
          <span>Data Protection & Privacy</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground">
          Last updated: February 2026 • How we collect, safeguard, and respect your personal data.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm p-6 sm:p-10 flex flex-col gap-8 text-xs text-muted-foreground leading-relaxed">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">1. Overview & Commitment</h2>
          <p>
            Forma (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. We strictly collect only the information necessary to fulfill your orders, provide customer concierge services, and curate personalized recommendations. We never sell, rent, or trade your personal data to third-party advertisers.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">2. Information We Collect</h2>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li><strong>Order & Contact Data:</strong> Name, shipping address, email, and phone number when placing an order or registering an account.</li>
            <li><strong>Payment Information:</strong> Handled entirely via PCI-DSS Level 1 certified payment processors with end-to-end 256-bit tokenization. We never store full card numbers on our servers.</li>
            <li><strong>Device & Browsing Metrics:</strong> Anonymous telemetry such as IP address, browser type, and pages visited to ensure responsive site performance.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">3. How We Use Your Data</h2>
          <p>
            Your information is used exclusively to dispatch orders, calculate accurate shipping duties, verify authentic reviews, and send shipment tracking updates. If subscribed to our newsletter, you may receive periodic notices of new releases, which you can opt out of anytime.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">4. Your Rights (GDPR & CCPA)</h2>
          <p>
            You have the right to request a copy of your stored personal data, update your address preferences, or request complete deletion of your account at any time by emailing privacy@forma.store.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-serif font-semibold text-foreground">5. Contact Data Officer</h2>
          <p>
            If you have questions regarding this policy, please contact our Privacy Team at <strong>privacy@forma.store</strong> or by mail to Forma Studio, 450 Mission Street, Suite 800, San Francisco, CA 94105.
          </p>
        </section>
      </Card>
    </div>
  )
}
