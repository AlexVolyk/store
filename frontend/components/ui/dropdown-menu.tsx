'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

function useDropdown() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("Dropdown components must be used within a DropdownMenu")
  }
  return context
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Handle outside interactions & escape key
  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent | MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("pointerdown", handlePointerDown)
      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("pointerdown", handlePointerDown)
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  children,
  asChild,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen } = useDropdown()

  if (asChild && React.isValidElement<React.HTMLAttributes<HTMLElement>>(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        children.props.onClick?.(e)
        setOpen(!open)
      },
      "aria-expanded": open,
      "aria-haspopup": true,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-haspopup="true"
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  className,
  align = "end",
}: {
  children: React.ReactNode
  className?: string
  align?: "start" | "end" | "center"
}) {
  const { open, setOpen } = useDropdown()

  if (!open) return null

  const alignClass =
    align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"

  return (
    <>
      {/* Invisible Touch Backdrop for instant, reliable mobile dismiss */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={() => setOpen(false)}
        onTouchStart={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        className={cn(
          "absolute top-full mt-2 min-w-[11rem] max-w-[calc(100vw-2rem)] z-50 overflow-hidden rounded-xl border border-border bg-card p-1.5 text-card-foreground shadow-xl animate-in fade-in-0 zoom-in-95 duration-150",
          alignClass,
          className
        )}
      >
        {children}
      </div>
    </>
  )
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  destructive,
  icon,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  destructive?: boolean
  icon?: React.ReactNode
}) {
  const { setOpen } = useDropdown()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(false)
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2.5 sm:py-2 text-xs font-medium outline-none transition-colors hover:bg-muted focus:bg-muted active:bg-muted/80 min-h-[38px] sm:min-h-0",
        destructive ? "text-destructive hover:bg-destructive/10 active:bg-destructive/15" : "text-foreground",
        className
      )}
    >
      {icon && <span className="size-4 shrink-0 text-muted-foreground">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} />
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", className)}>
      {children}
    </div>
  )
}
