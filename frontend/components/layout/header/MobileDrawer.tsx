'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  X,
  Compass,
  Watch,
  Box,
  Home,
  Heart,
  ShoppingBag,
  Package,
  Sun,
  Moon,
  LogOut,
  User,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Settings,
} from 'lucide-react'
import { useAuthStore, useWishlistStore, useCartStore } from '@/store/global.store'
import { LogoHeader } from './LogoHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { isLoggedIn, user, logout } = useAuthStore()
  const wishlistCount = useWishlistStore((state) => state.list.length)
  const cartCount = useCartStore((state) => state.list.length)

  const navCategories = [
    { label: 'All Products', href: '/', icon: <Compass className="size-4" /> },
    { label: 'Timepieces', href: '/?cats=Watches', icon: <Watch className="size-4" /> },
    { label: 'Objects', href: '/?cats=Objects', icon: <Box className="size-4" /> },
    { label: 'Living', href: '/?cats=Living', icon: <Home className="size-4" /> },
    { label: 'Brand Story', href: '/about', icon: <Sparkles className="size-4 text-primary" /> },
  ]

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      swipeDirection="left"
    >
      <DrawerContent className="max-w-[320px] h-full bg-card border-r border-border p-0 flex flex-col">
        {/* Drawer Header */}
        <DrawerHeader className="h-16 px-5 border-b border-border flex flex-row items-center justify-between shrink-0 bg-card">
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
          <LogoHeader />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close menu"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </Button>
        </DrawerHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6 bg-card">
          {/* Main Category Routes */}
          <div className="flex flex-col gap-1">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Explore Collections
            </span>
            {navCategories.map(({ label, href, icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary text-primary font-semibold'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{icon}</span>
                    <span>{label}</span>
                  </div>
                  <ArrowRight className="size-3 text-muted-foreground/60" />
                </Link>
              )
            })}
          </div>

          <Separator />

          {/* Quick Access: Shopping, Wishlist & Orders */}
          <div className="flex flex-col gap-1">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              My Shopping
            </span>

            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="size-4 text-primary" />
                <span>Shopping Bag</span>
              </div>
              {cartCount > 0 && (
                <Badge variant="default" className="text-[10px] px-2 py-0.5">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </Badge>
              )}
            </Link>

            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="size-4 text-destructive" />
                <span>Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5 text-destructive border-destructive/20">
                  {wishlistCount}
                </Badge>
              )}
            </Link>

            <Link
              href="/orders"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="size-4 text-primary" />
                <span>Order History</span>
              </div>
              <ArrowRight className="size-3 text-muted-foreground/60" />
            </Link>

            {isLoggedIn && user?.isAdmin && (
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="size-4 text-primary" />
                  <span>Admin Panel</span>
                </div>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-semibold border-primary/20 bg-secondary text-primary">
                  Admin
                </Badge>
              </Link>
            )}
          </div>

          <Separator />

          {/* Theme Preference Switch */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2.5 text-xs font-medium text-foreground">
              {theme === 'dark' ? <Moon className="size-4 text-primary" /> : <Sun className="size-4 text-amber-500" />}
              <span>Dark Appearance</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label="Toggle dark mode"
            />
          </div>
        </div>

        {/* Drawer Footer: User Profile / Auth */}
        <DrawerFooter className="p-4 border-t border-border bg-muted/40 shrink-0">
          {isLoggedIn && user ? (
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Avatar className="size-9 border border-border shrink-0">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                    <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email || 'customer@forma.store'}</p>
                </div>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  logout()
                  onClose()
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={onClose} className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs h-9 justify-center gap-2">
                  <User className="size-3.5" />
                  <span>Log in</span>
                </Button>
              </Link>
              <Link href="/register" onClick={onClose} className="w-full">
                <Button size="sm" className="w-full text-xs h-9 justify-center font-semibold">
                  <span>Create Account</span>
                </Button>
              </Link>
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
