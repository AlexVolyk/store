'use client'

import { usePathname } from 'next/navigation'
import { MyLogo } from '@/components/MyLogo'
import { TermsNote } from '@/components/auth/TermsNote'
import { LoginCard } from '@/components/auth/LoginCard'
import { RegisterCard } from '@/components/auth/RegisterCard'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function AuthPage() {
  const pathname = usePathname()
  const isLogin = pathname.includes('login')

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12 bg-background">
      <Card className="w-full max-w-[420px] shadow-lg border-border bg-card overflow-hidden">
        {/* Top brand accent bar */}
        <div className="h-1 bg-primary w-full" />

        <CardHeader className="flex flex-col items-center gap-3 text-center pb-4 pt-8">
          <div className="size-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg shadow-sm">
            <MyLogo width={18} height={18} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold font-serif tracking-tight text-foreground">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {isLogin ? 'Sign in to your Forma account' : 'Join Forma and start exploring curated collections'}
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 flex flex-col gap-6">
          {isLogin ? <LoginCard /> : <RegisterCard />}
          <TermsNote />
        </CardContent>
      </Card>
    </div>
  )
}
