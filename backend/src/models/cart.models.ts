import { db } from '../config/db.ts';
import { ICart } from '../types/index.ts';

const CartItemSchema = new db.Schema(
    {
        product: {
            type: db.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    {
        _id: false,
    },
);

const CartSchema = new db.Schema<ICart>(
    {
        user: {
            type: db.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        items: {
            type: [CartItemSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export const CartModel = db.model('Cart', CartSchema);
