'use client'

import { useState } from "react"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

type FieldProps = {
  label: string
  id: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder?: string
  autoComplete?: string
}

export function Field({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}: FieldProps) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-wide text-foreground/80"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={isPassword && showPw ? 'text' : type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          className={isPassword ? "pr-10" : undefined}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive font-medium mt-0.5">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}