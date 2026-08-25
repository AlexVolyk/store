'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Field } from "./Field"
import { LoginDTO, loginSchema } from "@/schemas/auth.schemas"
import { useAuthStore } from "@/store/global.store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type FieldErrors = Partial<Record<string, string>>

export function LoginCard() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [loginData, setLoginData] = useState<LoginDTO>({ email: 'alex@example.com', password: 'Password123' })
  const [loginErrors, setLoginErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse(loginData)
    if (!result.success) {
      const errs: FieldErrors = {}
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message })
      setLoginErrors(errs)
      return
    }
    setLoginErrors({})
    setSubmitting(true)

    setTimeout(() => {
      login({
        id: 'user-1',
        name: 'Alex Volyk',
        email: loginData.email,
        avatar: 'https://i.pravatar.cc/48?img=33',
      })
      setSubmitting(false)
      toast.success("Signed in successfully.")
      router.push('/')
    }, 300)
  }

  return (
    <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4">
      <Field
        label="Email address"
        id="login-email"
        type="email"
        value={loginData.email}
        onChange={(v) => setLoginData({ ...loginData, email: v })}
        error={loginErrors.email}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <Field
        label="Password"
        id="login-password"
        type="password"
        value={loginData.password}
        onChange={(v) => setLoginData({ ...loginData, password: v })}
        error={loginErrors.password}
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <div className="flex justify-end">
        <Link
          href="#"
          className="text-xs text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-10 font-semibold"
        >
          {submitting ? 'Signing in…' : 'Log in'}
        </Button>

        <div className="flex items-center gap-3 my-1">
          <Separator className="flex-1" />
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/register')}
          className="w-full h-10 font-semibold border-primary/40 text-primary hover:bg-secondary"
        >
          Create an account
        </Button>
      </div>
    </form>
  )
}