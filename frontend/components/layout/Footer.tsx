'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MyLogo } from '@/components/MyLogo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { footerLinkGroups, footerTerms } from '@/lib/defaultData'

function FooterLinks() {
  return (
    <>
      {footerLinkGroups.map(({ title, links }) => (
        <div key={title} className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <ul className="flex flex-col gap-2">
            {links.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

function FooterListOfTerms() {
  return (
    <div className="flex gap-4 flex-wrap">
      {footerTerms.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {label}
        </Link>
      ))}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card transition-colors">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="size-6 flex items-center justify-center bg-primary text-primary-foreground rounded transition-transform group-hover:scale-105 shadow-xs">
                <MyLogo width={11} height={11} />
              </div>
              <span className="text-base font-semibold font-serif text-foreground">
                Forma
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Curated objects for the considered life. Handcrafted mechanical timepieces and minimal home essentials. Est. 2018.
            </p>
          </div>

          <FooterLinks />

          {/* Newsletter Signup */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Newsletter
            </p>
            <p className="text-xs text-muted-foreground">
              New drops and rare finds, once a month.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-1.5 mt-1">
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-8 text-xs bg-muted/60"
              />
              <Button type="submit" size="sm" className="h-8 px-2.5" aria-label="Subscribe to newsletter">
                <ArrowRight className="size-3.5" />
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex items-center justify-between flex-wrap gap-4 text-xs text-muted-foreground">
          <p>© 2026 Forma. All rights reserved.</p>
          <FooterListOfTerms />
        </div>
      </div>
    </footer>
  )
}