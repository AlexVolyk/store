'use client'

import { useState, Suspense } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoHeader } from './LogoHeader'
import { Search } from './Search'
import { ThemeToggle } from './ThemeToggle'
import { NavLinks } from './NavLinks'
import { WishlistCart } from './WishlistCart'
import { UserDropdownMenu } from './UserDropdown'
import { MobileDrawer } from './MobileDrawer'

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Trigger + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open mobile navigation menu"
            className="md:hidden text-muted-foreground hover:text-foreground -ml-1"
          >
            <Menu className="size-5" />
          </Button>

          <LogoHeader />
        </div>

        {/* Center: Desktop Navigation Links */}
        <NavLinks />

        {/* Search */}
        <Suspense fallback={<div className="hidden sm:flex flex-1 max-w-xs ml-auto h-8" />}>
          <Search />
        </Suspense>

        {/* Right Cluster: Theme, Wishlist/Cart, User Account */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <ThemeToggle className="hidden sm:inline-flex" />
          <WishlistCart />
          <UserDropdownMenu />
        </div>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  )
}
