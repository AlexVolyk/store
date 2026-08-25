'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/lib/defaultData'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-1 ml-2" aria-label="Main Navigation">
      {navLinks.map(({ label, link }) => {
        const isActive = link === pathname
        return (
          <Link
            key={label}
            href={link}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-secondary text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}