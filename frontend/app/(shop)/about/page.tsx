import Link from 'next/link'
import { Sparkles, Watch, Feather, ShieldCheck, ArrowRight, ChevronRight, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ABOUT_VALUES, ABOUT_MILESTONES } from '@/lib/defaultData'

const ICON_MAP = {
  watch: <Watch className="size-5 text-primary" />,
  feather: <Feather className="size-5 text-primary" />,
  shield: <ShieldCheck className="size-5 text-primary" />,
}

export default function AboutPage() {
  return (
    <div className="max-w-[1080px] mx-auto pb-20 w-full flex flex-col gap-12 sm:gap-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">About Forma</span>
      </nav>

      {/* Hero Header */}
      <section className="text-center pt-2 max-w-3xl mx-auto flex flex-col items-center gap-4">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs text-primary border-primary/20 bg-secondary">
          <Sparkles className="size-3.5" />
          <span>Curated for the Considered Life</span>
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-foreground tracking-tight leading-tight">
          Objects made with patience, meant to outlive trends.
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Forma is a design studio and curated store dedicated to mechanical horology, architectural ceramics, and essential tools that bring calm and intentionality to everyday rituals.
        </p>
      </section>

      {/* Hero Editorial Showcase Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-h-[460px] border border-border shadow-xl bg-muted group">
        <img
          src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1600&q=85"
          alt="Forma design studio and curated objects"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-6 sm:p-10">
          <p className="text-white text-xs sm:text-sm font-serif italic max-w-lg">
            &ldquo;Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.&rdquo;
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">
            Our Guiding Philosophy
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            Every piece in our catalog is vetted against three uncompromising principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ABOUT_VALUES.map((v) => (
            <Card key={v.title} className="border-border bg-card shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="size-10 rounded-lg bg-secondary flex items-center justify-center border border-primary/20 shrink-0">
                  {ICON_MAP[v.iconType as keyof typeof ICON_MAP] || <Sparkles className="size-5 text-primary" />}
                </div>
                <h3 className="text-base font-serif font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline Journey */}
      <section className="flex flex-col gap-8 bg-muted/40 border border-border rounded-2xl p-6 sm:p-10">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            Our Journey
          </span>
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            From independent archive to global collective
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ABOUT_MILESTONES.map((m) => (
            <div key={m.year} className="flex flex-col gap-2 p-5 rounded-xl bg-card border border-border shadow-xs">
              <span className="text-xl font-serif font-bold text-primary">{m.year}</span>
              <h4 className="text-xs font-semibold text-foreground">{m.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-10 flex flex-col items-center gap-4 border-t border-border">
        <h3 className="text-2xl font-serif font-semibold text-foreground">
          Discover the Permanent Collection
        </h3>
        <p className="text-xs text-muted-foreground max-w-md">
          Explore our complete catalogue of hand-regulated mechanical timepieces and minimalist living objects.
        </p>
        <Link href="/">
          <Button className="font-semibold text-xs h-10 px-6 gap-2 shadow-sm">
            <Compass className="size-3.5" />
            <span>Explore Catalogue</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </section>
    </div>
  )
}
