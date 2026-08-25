import { create } from 'zustand'
import { DEFAULT_USER, DEFAULT_ORDERS } from '@/lib/defaultData'

export type WishlistStore = {
    list: number[]
    add: (id: number) => void
    remove: (id: number) => void
    reset: () => void
}

export type CartItemState = {
    productId: number
    quantity: number
}

export type CartStore = {
    list: number[]
    items: CartItemState[]
    add: (id: number, quantity?: number) => void
    updateQuantity: (id: number, quantity: number) => void
    remove: (id: number) => void
    reset: () => void
}

export const useWishlistStore = create<WishlistStore>((set) => ({
    list: [],
    add: (id) => set((state) => ({ list: state.list.includes(id) ? state.list : [...state.list, id] })),
    remove: (id) => set((state) => ({ list: state.list.filter((i) => i !== id) })),
    reset: () => set({ list: [] }),
}))

export const useCartStore = create<CartStore>((set) => ({
    list: [1],
    items: [{ productId: 1, quantity: 1 }],
    add: (id, quantity = 1) =>
        set((state) => {
            const existing = state.items.find((item) => item.productId === id)
            if (existing) {
                return {
                    items: state.items.map((item) =>
                        item.productId === id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                    list: state.list.includes(id) ? state.list : [...state.list, id],
                }
            }
            return {
                items: [...state.items, { productId: id, quantity }],
                list: state.list.includes(id) ? state.list : [...state.list, id],
            }
        }),
    updateQuantity: (id, quantity) =>
        set((state) => {
            if (quantity <= 0) {
                return {
                    items: state.items.filter((item) => item.productId !== id),
                    list: state.list.filter((i) => i !== id),
                }
            }
            return {
                items: state.items.map((item) =>
                    item.productId === id ? { ...item, quantity } : item
                ),
            }
        }),
    remove: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.productId !== id),
            list: state.list.filter((i) => i !== id),
        })),
    reset: () => set({ list: [], items: [] }),
}))

export type AuthUser = {
    id: string
    name: string
    avatar?: string
    email?: string
    phone?: string
    street?: string
    city?: string
    postalCode?: string
    country?: string
    bio?: string
    newsletter?: boolean
    isAdmin?: boolean
}

export type AuthStore = {
    isLoggedIn: boolean
    user: AuthUser | null
    login: (user?: AuthUser) => void
    logout: () => void
    updateUser: (data: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: true,
    user: DEFAULT_USER,
    login: (user) => set({
        isLoggedIn: true,
        user: user || DEFAULT_USER,
    }),
    logout: () => set({ isLoggedIn: false, user: null }),
    updateUser: (data) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
        })),
}))

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
    productId: number
    productName: string
    price: number
    quantity: number
    image?: string
    brand?: string
}

export interface UserOrder {
    id: string
    userId: string
    items?: OrderItem[]
    totalAmount?: number
    shippingAddress?: {
        name: string
        street: string
        city: string
        postalCode: string
    }
    productId?: number
    productName?: string
    orderStatus: OrderStatus
    createdAt: string
}

export type OrderStore = {
    orders: UserOrder[]
    addOrder: (order: UserOrder) => void
    updateOrderStatus: (orderId: string, status: OrderStatus) => void
    getUserProductOrderStatus: (userId: string, productId: number) => {
        isOwner: boolean
        isShipped: boolean
        status?: OrderStatus
        order?: UserOrder
    }
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    orders: DEFAULT_ORDERS,
    addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    updateOrderStatus: (orderId, status) =>
        set((state) => ({
            orders: state.orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)),
        })),
    getUserProductOrderStatus: (userId: string, productId: number) => {
        const order = get().orders.find((o) =>
            o.userId === userId && (
                o.productId === productId ||
                o.items?.some((item) => item.productId === productId)
            )
        )
        if (!order) {
            return { isOwner: false, isShipped: false }
        }
        const isShipped = order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
        return {
            isOwner: true,
            isShipped,
            status: order.orderStatus,
            order,
        }
    },
}))
