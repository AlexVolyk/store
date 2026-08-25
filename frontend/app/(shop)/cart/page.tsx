import type { Metadata } from 'next'
import { CartView } from './CartView'

export const metadata: Metadata = {
    title: 'Shopping Bag — Forma Store',
    description: 'Review your selected timepieces, handcrafted objects, and proceed to secure checkout.',
}

export default function CartPage() {
    return <CartView />
}