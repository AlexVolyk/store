import { Badge as UiBadge } from '@/components/ui/badge'

interface BadgeProps {
  badge?: string
  discount?: number | null
}

export function Badge({ badge, discount }: BadgeProps) {
  if (!badge && !discount) return null

  return (
    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
      {badge === 'Sale' && discount && (
        <UiBadge variant="destructive" className="text-[10px] px-2 py-0.5 shadow-sm font-bold">
          −{discount}%
        </UiBadge>
      )}
      {badge === 'New' && (
        <UiBadge variant="default" className="text-[10px] px-2 py-0.5 shadow-sm font-bold">
          New
        </UiBadge>
      )}
      {badge && badge !== 'Sale' && badge !== 'New' && (
        <UiBadge variant="accent" className="text-[10px] px-2 py-0.5 shadow-sm">
          {badge}
        </UiBadge>
      )}
    </div>
  )
}