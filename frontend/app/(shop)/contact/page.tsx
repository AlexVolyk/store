'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ChevronRight, HelpCircle } from 'lucide-react'
import { useAuthStore } from '@/store/global.store'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CONTACT_SUBJECTS, STUDIO_INFO } from '@/lib/defaultData'

export default function ContactPage() {
  const { user } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [orderNumber, setOrderNumber] = useState('')
  const [subject, setSubject] = useState(CONTACT_SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setMessage('')
      setOrderNumber('')
      toast.success('Thank you! Your message has been sent to our studio concierge.')
    }, 600)
  }

  return (
    <div className="max-w-[1040px] mx-auto pb-20 w-full flex flex-col gap-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Contact Concierge</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center pt-2 max-w-xl mx-auto flex flex-col items-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs text-primary border-primary/20 bg-secondary">
          <MessageSquare className="size-3.5" />
          <span>Client Care & Studio Concierge</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-tight">
          Get in Touch with Forma
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Whether you have questions about mechanical horology, shipping timelines, or custom orders, we are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Information Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-base font-serif">Studio Concierge</CardTitle>
              <CardDescription className="text-xs">
                We respond to all collector inquiries within 24 business hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Direct Email</h4>
                  <p className="text-muted-foreground mt-0.5">{STUDIO_INFO.email}</p>
                  <p className="text-[11px] text-muted-foreground">{STUDIO_INFO.pressEmail} (Editorial)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Studio Telephone</h4>
                  <p className="text-muted-foreground mt-0.5">{STUDIO_INFO.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Concierge Hours</h4>
                  <p className="text-muted-foreground mt-0.5">{STUDIO_INFO.hoursWeekday}</p>
                  <p className="text-[11px] text-muted-foreground">{STUDIO_INFO.hoursWeekend}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">San Francisco Studio</h4>
                  <p className="text-muted-foreground mt-0.5">
                    {STUDIO_INFO.addressLine1}<br />
                    {STUDIO_INFO.addressLine2}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick FAQ Callout */}
          <Card className="border-border bg-muted/40 shadow-xs p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <HelpCircle className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Have an urgent question?</p>
                <p className="text-[11px] text-muted-foreground">Check our instant knowledge base.</p>
              </div>
            </div>
            <Link href="/faq" className="shrink-0">
              <Button variant="outline" size="sm" className="text-xs h-8">
                View FAQ
              </Button>
            </Link>
          </Card>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7">
          <Card className="border-border bg-card shadow-md">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-serif font-semibold text-foreground">
                Send a Message
              </CardTitle>
              <CardDescription className="text-xs">
                Fill in the details below and our team will get back to you promptly.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-xs font-semibold text-foreground">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-xs font-semibold text-foreground">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-foreground">
                      Inquiry Topic
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="h-9 rounded-md border border-input bg-card px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {CONTACT_SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-order" className="text-xs font-semibold text-foreground">
                      Order ID (Optional)
                    </label>
                    <Input
                      id="contact-order"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="#ord-2026-001"
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-foreground">
                    Message <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="How can we help you with your order, mechanical timepiece, or custom request?"
                    required
                    className="text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-6 font-semibold text-xs gap-2 shadow-sm"
                  >
                    <Send className="size-3.5" />
                    <span>{isSubmitting ? 'Sending Message…' : 'Send Inquiry'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
