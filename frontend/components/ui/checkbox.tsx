import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: React.ReactNode
  badgeCount?: number
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      label,
      badgeCount,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn(
          "group flex items-center gap-2.5 py-0.5 cursor-pointer select-none text-sm font-normal",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all duration-150 group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-1",
            checked
              ? "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
              : "border-input bg-card hover:border-primary/60"
          )}
        >
          {checked && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
        {label && (
          <span
            className={cn(
              "text-xs leading-none transition-colors",
              checked ? "font-medium text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {label}
          </span>
        )}
        
        {badgeCount !== undefined && (
          <span className="ml-auto text-[11px] text-muted-foreground/70">
            {badgeCount}
          </span>
        )}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
