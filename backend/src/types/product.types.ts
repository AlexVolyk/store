import type { Document, Types } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    brand?: string;
    category: Types.ObjectId;
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
