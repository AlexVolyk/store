'use client'

import { useRouter } from 'next/navigation'
import { Package, Settings, LogOut, ChevronDown, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AccountDropdownProps {
  isAdmin: boolean
  onLogout: () => void
}

export function AccountDropdown({ isAdmin, onLogout }: AccountDropdownProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-primary/20 hover:bg-secondary/80 transition-all cursor-pointer shadow-sm"
        aria-label="Account menu"
      >
        <Avatar className="size-5 border-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
            A
          </AvatarFallback>
        </Avatar>
        <span className="text-xs">Account</span>
        <ChevronDown className="size-3 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push('/account')}
          icon={<User className="size-4" />}
        >
          Profile & Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/orders')}
          icon={<Package className="size-4" />}
        >
          My Orders
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => router.push('/admin')}
            icon={<Settings className="size-4" />}
          >
            Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          destructive
          icon={<LogOut className="size-4" />}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
