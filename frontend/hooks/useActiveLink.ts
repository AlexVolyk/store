'use client'

import { usePathname } from 'next/navigation'

export function useActiveLink(href: string) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
    return { isActive, pathname }
}

export default useActiveLink
