'use client'

import { Checkbox } from '@/components/ui/checkbox'

interface FancyCheckboxProps {
  checked: boolean
  onChange: () => void
  label: string
  count?: number
}

export function FancyCheckbox({ checked, onChange, label, count }: FancyCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={() => onChange()}
      label={label}
      badgeCount={count}
    />
  )
}
