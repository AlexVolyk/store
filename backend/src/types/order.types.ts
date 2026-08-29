import type { Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
    product: Types.ObjectId;
    name: string;
    image?: string;
    price: number;
    quantity: number;
}

export interface IShippingAddress {
    fullName: string;
    phone: string;
    city: string;
    postalCode: string;
    addressLine: string;
    country: string;
}

export interface IOrder extends Document {
    orderNumber: string;
    trackingNumber?: string;
    user: Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    paidAt?: Date;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
