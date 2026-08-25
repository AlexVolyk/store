import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/global.store'
import { AccountDropdown } from './AccountDropDown'

export function UserDropdownMenu() {
  const { isLoggedIn, user, logout } = useAuthStore()
  const isAdmin = Boolean(user?.isAdmin)

  return (
    <div className="hidden sm:flex shrink-0 items-center gap-1.5 sm:gap-2">
      {isLoggedIn ? (
        <AccountDropdown isAdmin={isAdmin} onLogout={logout} />
      ) : (
        <>
          <Link href="/login">
            <Button variant="outline" size="sm" className="text-xs h-8">
              Log in
            </Button>
          </Link>
          <Link href="/register" className="hidden md:inline-flex">
            <Button size="sm" className="text-xs h-8">
              Register
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}