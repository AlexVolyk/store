'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Field } from "./Field"
import { registerSchema, RegisterDTO } from "@/schemas/auth.schemas"
import { useAuthStore } from "@/store/global.store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type FieldErrors = Partial<Record<string, string>>

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-destructive', 'bg-amber-500', 'bg-emerald-500', 'bg-primary']

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              index < score ? colors[score - 1] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Password strength: <span className="font-semibold text-foreground">{labels[score - 1] ?? 'Too short'}</span>
      </p>
    </div>
  )
}

export function RegisterCard() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [regData, setRegData] = useState<RegisterDTO>({ firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', password: 'Password123' })
  const [regErrors, setRegErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse(regData)
    if (!result.success) {
      const errs: FieldErrors = {}
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message })
      setRegErrors(errs)
      return
    }
    setRegErrors({})
    setSubmitting(true)

    setTimeout(() => {
      login({
        id: `user-${Date.now()}`,
        name: `${regData.firstName} ${regData.lastName}`,
        email: regData.email,
        avatar: 'https://i.pravatar.cc/48?img=5',
      })
      setSubmitting(false)
      toast.success("Account created successfully.")
      router.push('/')
    }, 300)
  }

  return (
    <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="First name"
          id="reg-first"
          value={regData.firstName}
          onChange={(v) => setRegData({ ...regData, firstName: v })}
          error={regErrors.firstName}
          placeholder="Jane"
          autoComplete="given-name"
        />
        <Field
          label="Last name"
          id="reg-last"
          value={regData.lastName}
          onChange={(v) => setRegData({ ...regData, lastName: v })}
          error={regErrors.lastName}
          placeholder="Doe"
          autoComplete="family-name"
        />
      </div>

      <Field
        label="Email address"
        id="reg-email"
        type="email"
        value={regData.email}
        onChange={(v) => setRegData({ ...regData, email: v })}
        error={regErrors.email}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <div className="flex flex-col">
        <Field
          label="Password"
          id="reg-password"
          type="password"
          value={regData.password}
          onChange={(v) => setRegData({ ...regData, password: v })}
          error={regErrors.password}
          placeholder="••••••••"
          autoComplete="new-password"
        />
        <PasswordStrength password={regData.password} />
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-10 font-semibold"
        >
          {submitting ? 'Creating account…' : 'Register'}
        </Button>

        <div className="flex items-center gap-3 my-1">
          <Separator className="flex-1" />
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/login')}
          className="w-full h-10 font-semibold border-primary/40 text-primary hover:bg-secondary"
        >
          Log in instead
        </Button>
      </div>
    </form>
  )
}