import Link from "next/link"

export function TermsNote() {
  return (
    <p className="text-center text-[11px] text-muted-foreground mt-2">
      By continuing you agree to our{' '}
      <Link href="/" className="text-primary hover:underline font-medium">
        Terms
      </Link>{' '}
      and{' '}
      <Link href="/" className="text-primary hover:underline font-medium">
        Privacy Policy
      </Link>.
    </p>
  )
}

export default TermsNote
