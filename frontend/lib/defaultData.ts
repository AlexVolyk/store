// ==========================================
// 1. PRODUCTS & CATALOG DATA
// ==========================================

export interface Product {
  id: number
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  badge?: string
}

export interface Review {
  user: string
  avatar?: string
  rating: number
  comment: string
  date: string
}

export interface ProductDetail {
  id: number
  name: string
  description: string
  price: number
  discountPrice?: number
  stock: number
  images: string[]
  brand?: string
  category: string
  averageRating: number
  reviewCount: number
  isActive: boolean
  tags?: string[]
  sku?: string
  reviews: Review[]
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Analog Timepiece No. 7', brand: 'Leica', category: 'Accessories', price: 245, originalPrice: 349, rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1630558673281-46d2d315e235?w=480&h=560&fit=crop&auto=format', badge: 'Sale' },
  { id: 2, name: 'Ceramic Desk Object', brand: 'Muuto', category: 'Accessories', price: 89, rating: 4.5, reviews: 67, image: 'https://images.unsplash.com/photo-1617214922084-5db8d3c3df5a?w=480&h=560&fit=crop&auto=format' },
  { id: 3, name: 'Compact Film Camera', brand: 'Canon', category: 'Cameras', price: 389, originalPrice: 480, rating: 4.9, reviews: 312, image: 'https://images.unsplash.com/photo-1704942764294-25761b3932c4?w=480&h=560&fit=crop&auto=format', badge: 'New' },
  { id: 4, name: 'Studio Monitor Headphones', brand: 'Sony', category: 'Audio', price: 299, rating: 4.7, reviews: 891, image: 'https://images.unsplash.com/photo-1655657874630-2da5679ef515?w=480&h=560&fit=crop&auto=format' },
  { id: 5, name: 'Wireless Earbuds Pro', brand: 'Apple', category: 'Audio', price: 179, originalPrice: 229, rating: 4.6, reviews: 2341, image: 'https://images.unsplash.com/photo-1737805173358-e88d2e05c49e?w=480&h=560&fit=crop&auto=format', badge: 'Sale' },
  { id: 6, name: 'Sand Glass Diffuser', brand: 'Aesop', category: 'Accessories', price: 64, rating: 4.3, reviews: 55, image: 'https://images.unsplash.com/photo-1677726050564-6abb77837338?w=480&h=560&fit=crop&auto=format' },
  { id: 7, name: 'Vintage Desk Clock', brand: 'Leica', category: 'Accessories', price: 178, rating: 4.4, reviews: 88, image: 'https://images.unsplash.com/photo-1689525970033-948720b0ccf8?w=480&h=560&fit=crop&auto=format' },
  { id: 8, name: 'Coastal Edition Lotion', brand: 'Aesop', category: 'Accessories', price: 42, rating: 3.9, reviews: 33, image: 'https://images.unsplash.com/photo-1677725283527-fcf4d2973c07?w=480&h=560&fit=crop&auto=format' },
  { id: 9, name: 'Precision Wrist Tracker', brand: 'Apple', category: 'Wearables', price: 299, originalPrice: 399, rating: 4.8, reviews: 1204, image: 'https://images.unsplash.com/photo-1630558673281-46d2d315e235?w=480&h=560&fit=crop&auto=format', badge: 'Sale' },
  { id: 10, name: 'Noise-Cancel Speakers', brand: 'Sony', category: 'Audio', price: 549, rating: 4.9, reviews: 443, image: 'https://images.unsplash.com/photo-1655657874630-2da5679ef515?w=480&h=560&fit=crop&auto=format' },
  { id: 11, name: 'Portrait Lens 85mm', brand: 'Canon', category: 'Cameras', price: 699, rating: 4.7, reviews: 267, image: 'https://images.unsplash.com/photo-1704942764294-25761b3932c4?w=480&h=560&fit=crop&auto=format' },
  { id: 12, name: 'Slim Laptop Pro 14"', brand: 'Apple', category: 'Computers', price: 999, originalPrice: 1299, rating: 4.8, reviews: 3421, image: 'https://images.unsplash.com/photo-1737805173358-e88d2e05c49e?w=480&h=560&fit=crop&auto=format', badge: 'Sale' },
]

export const PRODUCT_DETAILS: ProductDetail[] = [
  {
    id: 1,
    name: 'Analog Timepiece No. 7',
    description:
      'A refined analog watch crafted for those who appreciate the understated beauty of mechanical timekeeping. The case is machined from a single block of 316L stainless steel, finished with a hand-brushed satin texture across the lugs and a polished bezel. The dial is minimalist by design — no date complication, no clutter — just elegant applied indices and a sweeping seconds hand. Water-resistant to 50 metres.',
    price: 349,
    discountPrice: 245,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1630558673281-46d2d315e235?w=900&h=1050&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&h=1050&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900&h=1050&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=1050&fit=crop&auto=format',
    ],
    brand: 'Leica',
    category: 'Accessories',
    averageRating: 4.8,
    reviewCount: 124,
    isActive: true,
    tags: ['Mechanical', 'Sapphire Crystal', 'Swiss Movement', 'Water Resistant'],
    sku: 'LCA-AT7-SS',
    reviews: [
      {
        user: 'Marcus Webb',
        avatar: 'https://i.pravatar.cc/48?img=11',
        rating: 5,
        comment:
          'Exceptional quality. The finishing on the case is immaculate — you can feel the weight distribution is perfectly balanced on the wrist. Strap broke in after a week and it now feels like a second skin.',
        date: '2025-11-14',
      },
      {
        user: 'Sofia Andersen',
        avatar: 'https://i.pravatar.cc/48?img=5',
        rating: 5,
        comment:
          'I was skeptical at this price point but this watch surpassed every expectation. The sapphire crystal has zero distortion and the dial colour in natural light is just stunning.',
        date: '2025-10-03',
      },
      {
        user: 'Daniel Park',
        avatar: 'https://i.pravatar.cc/48?img=15',
        rating: 4,
        comment:
          'Beautiful watch. The only minor gripe is that the crown is slightly stiff to operate. Nothing that detracts from daily wear but worth noting.',
        date: '2025-09-28',
      },
      {
        user: 'Elena Rossi',
        avatar: 'https://i.pravatar.cc/48?img=9',
        rating: 5,
        comment:
          'Bought this as a gift and the unboxing experience was outstanding. Solid leather-lined box, authenticity card, tool for strap adjustment — every detail thought through.',
        date: '2025-08-19',
      },
    ],
  },
  {
    id: 3,
    name: 'Compact Film Camera',
    description:
      'The definitive 35mm point-and-shoot for the modern photographer. Compact enough for a jacket pocket yet equipped with a fast 35mm f/2.8 lens that renders backgrounds with pleasing out-of-focus qualities. The automatic exposure system handles the technical side so you can focus entirely on composition. Compatible with any standard 35mm film — ISO 50 through 3200.',
    price: 480,
    discountPrice: 389,
    stock: 3,
    images: [
      'https://images.unsplash.com/photo-1704942764294-25761b3932c4?w=900&h=1050&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1452780212132-cbb4cf4a2c98?w=900&h=1050&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=1050&fit=crop&auto=format',
    ],
    brand: 'Canon',
    category: 'Cameras',
    averageRating: 4.9,
    reviewCount: 312,
    isActive: true,
    tags: ['35mm Film', 'Auto Exposure', 'f/2.8 Lens', 'DX Coding'],
    sku: 'CNS-CFC-35',
    reviews: [
      {
        user: 'James Okafor',
        avatar: 'https://i.pravatar.cc/48?img=3',
        rating: 5,
        comment:
          'I have shot about 15 rolls through this now and it has not missed a single frame. The lens is sharp from corner to corner at f/2.8 which is rare for a compact.',
        date: '2025-12-01',
      },
      {
        user: 'Hana Kobayashi',
        avatar: 'https://i.pravatar.cc/48?img=47',
        rating: 5,
        comment:
          'Perfect for travel. Light, discreet, and produces absolutely gorgeous results. The auto-exposure nails it even in tricky mixed lighting.',
        date: '2025-11-22',
      },
      {
        user: 'Tom Laurent',
        avatar: 'https://i.pravatar.cc/48?img=21',
        rating: 4,
        comment:
          'Great camera, slightly noisy motor advance. Not a dealbreaker but if you are shooting in a quiet theatre you might get looks.',
        date: '2025-10-11',
      },
    ],
  },
]

export function getProductById(id: number): ProductDetail | undefined {
  const existing = PRODUCT_DETAILS.find((p) => p.id === id)
  if (existing) return existing

  const catalogItem = PRODUCTS.find((p) => p.id === id)
  if (!catalogItem) return undefined

  return {
    id: catalogItem.id,
    name: catalogItem.name,
    description: `Experience the finest craftsmanship with ${catalogItem.name}. Designed with utmost attention to detail and premium materials to elevate your daily routine.`,
    price: catalogItem.originalPrice ?? catalogItem.price,
    discountPrice: catalogItem.originalPrice ? catalogItem.price : undefined,
    stock: 6,
    images: [
      catalogItem.image,
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&h=1050&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900&h=1050&fit=crop&auto=format',
    ],
    brand: catalogItem.brand,
    category: catalogItem.category,
    averageRating: catalogItem.rating,
    reviewCount: catalogItem.reviews,
    isActive: true,
    tags: [catalogItem.category, catalogItem.brand, 'Premium Quality'],
    sku: `FRM-${catalogItem.brand.slice(0, 3).toUpperCase()}-${catalogItem.id.toString().padStart(3, '0')}`,
    reviews: [
      {
        user: 'Marcus Webb',
        avatar: 'https://i.pravatar.cc/48?img=11',
        rating: 5,
        comment: 'Exceeded all expectations. Build quality and finishing are truly world-class.',
        date: '2025-11-20',
      },
      {
        user: 'Elena Rossi',
        avatar: 'https://i.pravatar.cc/48?img=9',
        rating: 4,
        comment: 'Very solid and stylish design. Would highly recommend to anyone considering it.',
        date: '2025-10-15',
      },
    ],
  }
}

export const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))].sort()
export const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort()
export const RATINGS = [4, 3, 2]
export const PAGE_SIZE = 16

// ==========================================
// 2. NAVIGATION & SORTING DATA
// ==========================================

export const navLinks = [
  { label: 'All Products', active: false, link: '/' },
  { label: 'Timepieces', active: false, link: '/?cats=Watches' },
  { label: 'Objects', active: false, link: '/?cats=Objects' },
  { label: 'Living', active: false, link: '/?cats=Living' },
  { label: 'About', active: false, link: '/about' },
]

export const sortOptions = [
  { value: 'featured', text: 'Featured' },
  { value: 'price-asc', text: 'Price: Low → High' },
  { value: 'price-desc', text: 'Price: High → Low' },
  { value: 'rating', text: 'Top Rated' },
]

export const footerLinkGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/' },
      { label: 'Timepieces', href: '/?cats=Watches' },
      { label: 'Objects', href: '/?cats=Objects' },
      { label: 'Living', href: '/?cats=Living' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Brand Story', href: '/about' },
      { label: 'Studio & Location', href: '/contact' },
      { label: 'Account Settings', href: '/account' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Shipping & Returns', href: '/shipping' },
      { label: 'FAQ & Watch Care', href: '/faq' },
      { label: 'Contact Concierge', href: '/contact' },
    ],
  },
]

export const footerTerms = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

// ==========================================
// 3. ABOUT & BRAND STORY DATA
// ==========================================

export const ABOUT_VALUES = [
  {
    iconType: 'watch',
    title: 'Mechanical Permanence',
    desc: 'We reject planned obsolescence. Every timepiece in our curation relies on mechanical precision and serviceable movements designed to last generations.',
  },
  {
    iconType: 'feather',
    title: 'Tactile Minimalism',
    desc: 'Inspired by Japanese wabi-sabi and Nordic functionalism, our objects celebrate raw ceramic textures, brushed stainless steel, and unvarnished timber.',
  },
  {
    iconType: 'shield',
    title: 'Artisanal Integrity',
    desc: 'We partner directly with independent studios and multi-generational family workshops across Kyoto, Solothurn, and Scandinavia.',
  },
]

export const ABOUT_MILESTONES = [
  { year: '2018', title: 'Studio Founded', desc: 'Forma began in San Francisco as an independent archive and curation journal for mechanical timepieces.' },
  { year: '2021', title: 'Living Objects Collection', desc: 'Expanded into handcrafted cast-iron teaware, ceramic desk goods, and architectural home objects.' },
  { year: '2024', title: 'Zero-Plastic Pledge', desc: 'Transitioned 100% of our global packaging to biodegradable unbleached cotton pouches and recycled kraft paper.' },
  { year: '2026', title: 'Permanent Archive', desc: 'Over 40,000 collectors across 65 countries trust Forma for daily functional art.' },
]

// ==========================================
// 4. FAQ & KNOWLEDGE BASE DATA
// ==========================================

export const FAQ_ITEMS = [
  {
    category: 'Shipping',
    q: 'How long does standard delivery take?',
    a: 'Domestic US orders are dispatched within 24 business hours from our San Francisco hub and arrive in 2–4 business days via DHL Express / FedEx. International shipments typically take 4–7 business days with full door-to-door tracking.',
  },
  {
    category: 'Shipping',
    q: 'Do you offer free shipping?',
    a: 'Yes. All orders over $150 automatically unlock complimentary express tracked shipping globally. Orders below $150 have a flat-rate shipping fee of $15.',
  },
  {
    category: 'Shipping',
    q: 'Are customs duties and import taxes included?',
    a: 'For orders to the US, EU, UK, Canada, and Japan, all duties and VAT taxes are calculated and prepaid at checkout (DDP terms). No unexpected fees will be charged upon delivery.',
  },
  {
    category: 'Timepieces',
    q: 'What warranty is included with Forma timepieces?',
    a: 'Every mechanical watch includes an international 3-year limited warranty covering mechanical movement defects, casing integrity, and dial assembly. We also offer certified movement servicing through our workshop.',
  },
  {
    category: 'Timepieces',
    q: 'How should I care for my mechanical automatic watch?',
    a: 'Automatic watches wind with daily wrist motion. If unworn for more than 40 hours, gently hand-wind the crown clockwise 20–25 turns. Avoid exposing mechanical movements to strong magnetic fields (e.g. powerful speaker magnets or MRI machines).',
  },
  {
    category: 'Returns',
    q: 'What is your return policy?',
    a: 'We offer a 30-day effortless return and exchange policy on all unworn items in their original packaging with protective films intact. Return shipping labels are complimentary for domestic orders.',
  },
  {
    category: 'Returns',
    q: 'How quickly are refunds processed?',
    a: 'Once your returned object arrives at our inspection studio, our team examines the piece within 48 hours. Your refund will be credited back to your original payment method within 3–5 banking days.',
  },
  {
    category: 'Payments',
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and encrypted checkout protocols with 256-bit SSL encryption.',
  },
  {
    category: 'Living',
    q: 'Are your cast iron kettles and ceramics food-safe?',
    a: 'Yes. All tableware, ceramics, and kettles are certified lead-free, non-toxic, and crafted in compliance with international food safety standards (FDA & EU 1935/2004).',
  },
]

export const FAQ_CATEGORIES = ['All', 'Shipping', 'Timepieces', 'Returns', 'Payments', 'Living']

// ==========================================
// 5. SHIPPING & RETURNS POLICY DATA
// ==========================================

export const SHIPPING_TIERS = [
  {
    region: 'United States (Domestic)',
    courier: 'DHL Express / FedEx Ground',
    time: '2 – 4 business days',
    cost: 'Free on orders over $150 ($15 flat rate otherwise)',
  },
  {
    region: 'Canada & Mexico',
    courier: 'DHL Express International',
    time: '3 – 5 business days',
    cost: 'Free on orders over $200 ($20 flat rate otherwise)',
  },
  {
    region: 'European Union & United Kingdom',
    courier: 'DHL Express Worldwide (DDP Taxes Included)',
    time: '4 – 6 business days',
    cost: 'Free on orders over $200 ($25 flat rate otherwise)',
  },
  {
    region: 'Japan, Singapore & Asia-Pacific',
    courier: 'FedEx International Priority',
    time: '4 – 7 business days',
    cost: 'Free on orders over $250 ($30 flat rate otherwise)',
  },
]

export const RETURN_STEPS = [
  {
    step: '01',
    title: 'Initiate Request',
    desc: 'Visit your Order History within 30 days of delivery and select "Request Return" on eligible items.',
  },
  {
    step: '02',
    title: 'Complimentary Label',
    desc: 'Receive your pre-paid printable return shipping label via email with instant tracking.',
  },
  {
    step: '03',
    title: 'Pack & Ship',
    desc: 'Place the unworn object in its original archival packaging and hand it to your local courier.',
  },
  {
    step: '04',
    title: 'Prompt Refund',
    desc: 'Once inspected at our studio, your original payment method will be credited within 3–5 business days.',
  },
]

// ==========================================
// 6. CONTACT & STUDIO DETAILS DATA
// ==========================================

export const CONTACT_SUBJECTS = [
  'Order & Shipping Status',
  'Product Specifications & Watch Care',
  'Return or Exchange Request',
  'Press, Editorial & Wholesale',
  'General Inquiries',
]

export const STUDIO_INFO = {
  email: 'concierge@forma.store',
  pressEmail: 'press@forma.store',
  phone: '+1 (415) 890-3200',
  hoursWeekday: 'Monday – Friday: 9 AM – 6 PM PST',
  hoursWeekend: 'Saturday: 10 AM – 4 PM PST',
  addressLine1: '450 Mission Street, Suite 800',
  addressLine2: 'San Francisco, CA 94105',
}

// ==========================================
// 7. USER & ACCOUNT PRESETS DATA
// ==========================================

export const AVATAR_PRESETS = [
  'https://i.pravatar.cc/120?img=33',
  'https://i.pravatar.cc/120?img=12',
  'https://i.pravatar.cc/120?img=53',
  'https://i.pravatar.cc/120?img=68',
  'https://i.pravatar.cc/120?img=5',
  'https://i.pravatar.cc/120?img=47',
]

export const DEFAULT_USER = {
  id: 'user-1',
  name: 'Alex Volyk',
  avatar: 'https://i.pravatar.cc/48?img=33',
  email: 'alex@example.com',
  phone: '+1 (555) 234-5678',
  street: '123 Heritage Way',
  city: 'San Francisco, CA',
  postalCode: '94103',
  country: 'United States',
  bio: 'Collector of mechanical objects, ceramics, and timeless home goods.',
  newsletter: true,
  isAdmin: true,
}

// ==========================================
// 8. ORDERS DATA
// ==========================================

export const DEFAULT_ORDERS = [
  {
    id: 'ord-2026-001',
    userId: 'user-1',
    items: [
      {
        productId: 1,
        productName: 'Analog Timepiece No. 7',
        price: 285,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        brand: 'Forma Studio',
      },
      {
        productId: 4,
        productName: 'Cast Iron Kettle',
        price: 135,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80',
        brand: 'Forma Living',
      },
    ],
    totalAmount: 420,
    shippingAddress: {
      name: 'Alex Volyk',
      street: '123 Heritage Way',
      city: 'San Francisco, CA',
      postalCode: '94103',
    },
    orderStatus: 'shipped' as const,
    createdAt: '2026-02-14',
    productId: 1,
    productName: 'Analog Timepiece No. 7',
  },
  {
    id: 'ord-2026-002',
    userId: 'user-1',
    items: [
      {
        productId: 2,
        productName: 'Ceramic Desk Object',
        price: 64,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
        brand: 'Kanso Objects',
      },
    ],
    totalAmount: 143,
    shippingAddress: {
      name: 'Alex Volyk',
      street: '123 Heritage Way',
      city: 'San Francisco, CA',
      postalCode: '94103',
    },
    orderStatus: 'processing' as const,
    createdAt: '2026-02-22',
    productId: 2,
    productName: 'Ceramic Desk Object',
  },
]