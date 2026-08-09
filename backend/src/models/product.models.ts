import { db } from '../config/db.ts';
import { IProduct } from '../types/index.ts';

const ProductSchema = new db.Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discountPrice: {
            type: Number,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        brand: {
            type: String,
            trim: true,
        },
        category: {
            type: db.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            index: true,
        },
        averageRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        reviewCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export const ProductModel = db.model('Product', ProductSchema);
