'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search as SearchIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Search() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const paramSearch = searchParams?.get('search') || ''
  const [search, setSearch] = useState(paramSearch)
  const [prevParamSearch, setPrevParamSearch] = useState(paramSearch)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // Sync state with searchParams when URL changes externally
  if (paramSearch !== prevParamSearch) {
    setPrevParamSearch(paramSearch)
    setSearch(paramSearch)
  }

  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus()
    }
  }, [isMobileSearchOpen])

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleClear = () => {
    handleSearchChange('')
  }

  const setParamsInput = (value: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
    if (value.trim()) {
      params.set('search', value.trim())
      params.delete('page')
    } else {
      params.delete('search')
    }

    const basePath = pathname === '/' || pathname.includes('/(shop)') ? '/' : pathname
    router.push(`${basePath}?${params.toString()}`, { scroll: false })
  }

  const onKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setParamsInput(e.currentTarget.value)
    }
  }

  return (
    <>
      {/* Desktop / Tablet Inline Search Bar */}
      <div className="relative hidden sm:flex flex-1 max-w-xs ml-auto">
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-8 pr-8 h-8 text-xs bg-muted/50 focus-visible:bg-card transition-all"
          aria-label="Search products"
          onKeyUp={onKeyEnter}
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Mobile Search Trigger Icon Button */}
      <div className="flex sm:hidden ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          aria-label={isMobileSearchOpen ? 'Close search' : 'Search'}
          className={isMobileSearchOpen ? 'text-primary bg-muted' : 'text-muted-foreground'}
        >
          {isMobileSearchOpen ? <X className="size-4" /> : <SearchIcon className="size-4" />}
        </Button>
      </div>

      {/* Mobile Expandable Search Bar Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 p-3 bg-card border-b border-border shadow-md z-40 sm:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                ref={mobileInputRef}
                type="text"
                placeholder="Search collection, brands, materials…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8 pr-8 h-9 text-xs bg-muted/60 focus-visible:bg-card"
                aria-label="Search collection"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-xs h-9 px-2.5 text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  )
}