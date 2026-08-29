import { InferSchemaType } from 'mongoose';
import { db } from '../config/db.ts';
import { IOrder, ORDER_STATUSES, PAYMENT_STATUSES } from '../types/index.ts';

const OrderItemSchema = new db.Schema(
    {
        product: {
            type: db.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        _id: false,
    },
);

const ShippingAddressSchema = new db.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        postalCode: {
            type: String,
            required: true,
            trim: true,
        },
        addressLine: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    },
);

const OrderSchema = new db.Schema<IOrder>(
    {
        orderNumber: {
            type: String,
            unique: true,
            default: () =>
                `ORD-${Date.now()
.toString()
.slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
        },
        trackingNumber: {
            type: String,
            default: null,
        },
        user: {
            type: db.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        items: {
            type: [OrderItemSchema],
            required: true,
            validate: {
                validator(items: unknown[]) {
                    return items.length > 0;
                },
                message: 'Order must contain at least one item',
            },
        },
        shippingAddress: {
            type: ShippingAddressSchema,
            required: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true,
        },
        paymentStatus: {
            type: String,
            enum: PAYMENT_STATUSES,
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ORDER_STATUSES,
            default: 'pending',
        },
        itemsPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        taxPrice: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        paidAt: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

// Index for fast query of user's order history sorted by latest first
OrderSchema.index({ user: 1, createdAt: -1 });

export const OrderModel = db.model('Order', OrderSchema);
export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;
