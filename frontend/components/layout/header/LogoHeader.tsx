import Link from 'next/link'
import { MyLogo } from '@/components/MyLogo'

export function LogoHeader() {
  return (
    <Link href="/" className="shrink-0 flex items-center gap-2 group">
      <div className="size-7 flex items-center justify-center bg-primary text-primary-foreground rounded-md transition-transform group-hover:scale-105 shadow-sm">
        <MyLogo width={13} height={13} />
      </div>
      <span className="text-[18px] font-semibold font-serif tracking-tight text-foreground">
        Forma
      </span>
    </Link>
  )
}
