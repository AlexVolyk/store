import type { Document, Types } from 'mongoose';
import type { OrderStatus, PaymentStatus } from '../constants/index.ts';

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
    notes?: string;
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
