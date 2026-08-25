'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Package,
  Heart,
  ShoppingBag,
  Camera,
  Save,
  LogOut,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react'
import { useAuthStore, useOrderStore, useWishlistStore, useCartStore } from '@/store/global.store'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { AVATAR_PRESETS } from '@/lib/defaultData'

export default function AccountPage() {
  const { isLoggedIn, user, updateUser, logout } = useAuthStore()
  const orders = useOrderStore((state) => state.orders)
  const wishlistCount = useWishlistStore((state) => state.list.length)
  const cartCount = useCartStore((state) => state.list.length)

  // Local Form States initialized from Store User
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0])
  const [street, setStreet] = useState(user?.street || '')
  const [city, setCity] = useState(user?.city || '')
  const [postalCode, setPostalCode] = useState(user?.postalCode || '')
  const [country, setCountry] = useState(user?.country || 'United States')
  const [newsletter, setNewsletter] = useState(user?.newsletter ?? true)

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Full name is required.')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsSaving(true)

    setTimeout(() => {
      updateUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        avatar,
        street: street.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        newsletter,
      })

      setIsSaving(false)
      toast.success('Your profile details have been saved successfully.')
    }, 400)
  }

  // Handle Password Update
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error('Please enter your current password.')
      return
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.')
      return
    }

    setIsChangingPassword(true)

    setTimeout(() => {
      setIsChangingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password changed successfully.')
    }, 500)
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="size-20 rounded-full flex items-center justify-center mb-6 bg-secondary text-primary border border-primary/20 shadow-sm">
          <User className="size-9 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl font-semibold font-serif text-foreground mb-2">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
          Access your personal preferences, order archive, saved addresses, and concierge inquiries.
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button className="px-6 h-10 font-semibold shadow-sm text-xs">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="px-6 h-10 text-xs">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const userOrders = orders.filter((o) => o.userId === user.id)

  return (
    <div className="max-w-[1040px] mx-auto pb-20 w-full">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-7 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Account Settings</span>
      </nav>

      {/* Header Profile Overview Banner Card */}
      <Card className="border-border bg-card shadow-sm mb-8 overflow-hidden">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="size-16 sm:size-20 border-2 border-primary/20 shadow-sm">
                {avatar && <AvatarImage src={avatar} alt={user.name} />}
                <AvatarFallback className="text-xl font-bold font-serif bg-secondary text-primary">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => {
                  const nextIdx = (AVATAR_PRESETS.indexOf(avatar) + 1) % AVATAR_PRESETS.length
                  setAvatar(AVATAR_PRESETS[nextIdx])
                  toast.info('Switched avatar preset. Click "Save Profile Details" to apply.')
                }}
                className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                title="Cycle avatar preset"
                aria-label="Cycle avatar preset"
              >
                <Camera className="size-3" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                  {user.name}
                </h1>
                {user.isAdmin && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-primary border-primary/20 font-semibold">
                    Admin
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                  Member
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3 text-muted-foreground/60" />
                <span>{user.email}</span>
              </p>

              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span className="text-[11px] text-muted-foreground">Forma Verified Client</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
            <Link href="/orders">
              <div className="flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-muted/60 hover:bg-muted border border-border transition-colors text-center cursor-pointer">
                <span className="text-sm font-semibold font-serif text-foreground">{userOrders.length}</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Package className="size-3 text-primary" /> Orders
                </span>
              </div>
            </Link>

            <Link href="/wishlist">
              <div className="flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-muted/60 hover:bg-muted border border-border transition-colors text-center cursor-pointer">
                <span className="text-sm font-semibold font-serif text-foreground">{wishlistCount}</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Heart className="size-3 text-destructive" /> Saved
                </span>
              </div>
            </Link>

            <Link href="/cart">
              <div className="flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-muted/60 hover:bg-muted border border-border transition-colors text-center cursor-pointer">
                <span className="text-sm font-semibold font-serif text-foreground">{cartCount}</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ShoppingBag className="size-3 text-primary" /> Bag
                </span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Account Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Navigation Tabs Sidebar */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <Card className="border-border bg-card shadow-sm p-2">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 w-full">
                <TabsTrigger
                  value="profile"
                  className="w-full justify-start gap-3 px-3.5 py-3 rounded-lg text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:font-semibold shadow-none"
                >
                  <User className="size-4 shrink-0" />
                  <span>Personal Information</span>
                </TabsTrigger>

                <TabsTrigger
                  value="address"
                  className="w-full justify-start gap-3 px-3.5 py-3 rounded-lg text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:font-semibold shadow-none"
                >
                  <MapPin className="size-4 shrink-0" />
                  <span>Shipping & Address</span>
                </TabsTrigger>

                <TabsTrigger
                  value="security"
                  className="w-full justify-start gap-3 px-3.5 py-3 rounded-lg text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:font-semibold shadow-none"
                >
                  <Lock className="size-4 shrink-0" />
                  <span>Security & Password</span>
                </TabsTrigger>
              </TabsList>

              <Separator className="my-1.5" />

              {/* Logout Alert Dialog */}
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="size-4 shrink-0" />
                      <span>Log out of Forma</span>
                    </button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out of Forma?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to sign back in with your email address to access your order history and saved items.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={logout}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Log Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          </div>

          {/* Content Panel Area */}
          <div className="md:col-span-8">
            {/* ── TAB 1: PERSONAL INFORMATION ── */}
            <TabsContent value="profile" className="mt-0">
              <Card className="border-border bg-card shadow-sm animate-in fade-in-50 duration-200">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-lg font-serif font-semibold text-foreground">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Update your public profile, contact email, and avatar icon.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                    {/* Avatar Picker */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-foreground">
                        Choose an Avatar
                      </label>
                      <div className="flex items-center gap-3 flex-wrap">
                        {AVATAR_PRESETS.map((src, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(src)}
                            className={`size-12 rounded-full overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                              avatar === src ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-border opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={src} alt={`Avatar preset ${idx + 1}`} className="w-full h-full rounded-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="user-name" className="text-xs font-semibold text-foreground">
                          Full Name
                        </label>
                        <Input
                          id="user-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Volyk"
                          required
                          className="text-xs h-9"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="user-email" className="text-xs font-semibold text-foreground">
                          Email Address
                        </label>
                        <div className="relative">
                          <Input
                            id="user-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@example.com"
                            required
                            className="text-xs h-9 pr-8"
                          />
                          <Mail className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="user-phone" className="text-xs font-semibold text-foreground">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Input
                          id="user-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 234-5678"
                          className="text-xs h-9 pr-8"
                        />
                        <Phone className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="user-bio" className="text-xs font-semibold text-foreground">
                        Bio / Collector Note
                      </label>
                      <Textarea
                        id="user-bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder="Share a short note about your interior aesthetic or collection focus..."
                        className="text-xs"
                        maxLength={300}
                      />
                      <span className="text-[11px] text-muted-foreground text-right">
                        {bio.length}/300
                      </span>
                    </div>

                    {/* Switch Toggle for Newsletter */}
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border border-border/60">
                      <div className="flex flex-col gap-0.5">
                        <label htmlFor="user-newsletter" className="text-xs font-semibold text-foreground cursor-pointer">
                          Forma Private Release Bulletins
                        </label>
                        <span className="text-[11px] text-muted-foreground">
                          Receive notifications about limited-run timepieces and archive drops
                        </span>
                      </div>
                      <Switch
                        id="user-newsletter"
                        checked={newsletter}
                        onCheckedChange={setNewsletter}
                      />
                    </div>

                    <div className="flex justify-end pt-3 border-t border-border">
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-9 px-5 font-semibold text-xs gap-2"
                      >
                        <Save className="size-3.5" />
                        <span>{isSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── TAB 2: SHIPPING & ADDRESS ── */}
            <TabsContent value="address" className="mt-0">
              <Card className="border-border bg-card shadow-sm animate-in fade-in-50 duration-200">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-lg font-serif font-semibold text-foreground">
                    Default Shipping Address
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Your preferred delivery address pre-filled during checkout.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="street-addr" className="text-xs font-semibold text-foreground">
                        Street Address
                      </label>
                      <Input
                        id="street-addr"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="123 Heritage Way, Suite 400"
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="city-addr" className="text-xs font-semibold text-foreground">
                          City
                        </label>
                        <Input
                          id="city-addr"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="San Francisco, CA"
                          className="text-xs h-9"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="postal-addr" className="text-xs font-semibold text-foreground">
                          Postal / ZIP Code
                        </label>
                        <Input
                          id="postal-addr"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="94103"
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="country-addr" className="text-xs font-semibold text-foreground">
                        Country / Region
                      </label>
                      <Input
                        id="country-addr"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="flex justify-end pt-3 border-t border-border">
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-9 px-5 font-semibold text-xs gap-2"
                      >
                        <Save className="size-3.5" />
                        <span>{isSaving ? 'Updating Address...' : 'Update Shipping Address'}</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── TAB 3: SECURITY & PASSWORD ── */}
            <TabsContent value="security" className="mt-0">
              <Card className="border-border bg-card shadow-sm animate-in fade-in-50 duration-200">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-lg font-serif font-semibold text-foreground">
                    Security & Password
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Update your authentication credentials and manage session security.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="current-pw" className="text-xs font-semibold text-foreground">
                        Current Password
                      </label>
                      <Input
                        id="current-pw"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="new-pw" className="text-xs font-semibold text-foreground">
                          New Password
                        </label>
                        <Input
                          id="new-pw"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="text-xs h-9"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="confirm-pw" className="text-xs font-semibold text-foreground">
                          Confirm New Password
                        </label>
                        <Input
                          id="confirm-pw"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-secondary/50 border border-primary/20 flex items-start gap-2.5 text-xs text-foreground">
                      <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Use at least 8 characters with a blend of letters, numbers, and symbols for high strength.
                      </span>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-border">
                      <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="h-9 px-5 font-semibold text-xs gap-2"
                      >
                        <Lock className="size-3.5" />
                        <span>{isChangingPassword ? 'Updating Password...' : 'Change Password'}</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
