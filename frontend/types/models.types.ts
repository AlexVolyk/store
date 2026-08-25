export interface Category {
    _id: string;
    name: string;
    description?: string;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    phone?: string;
    avatar: string | null;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    brand?: string;
    category: string;
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
}

export interface CartItem {
    product: string;
    quantity: number;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
}

export interface Wishlist {
    _id: string;
    user: string;
    products: string[];
}

export interface Review {
    _id: string;
    user: string;
    product: string;
    rating: number;
    comment: string;
    createdAt?: string;
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    city: string;
    postalCode: string;
    addressLine: string;
    country: string;
}

export interface OrderItem {
    product: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    orderStatus:
        | 'pending'
        | 'processing'
        | 'shipped'
        | 'delivered'
        | 'cancelled';
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    paidAt: string | null;
    deliveredAt: string | null;
}
