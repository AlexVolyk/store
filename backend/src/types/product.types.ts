import type { Document, Types } from 'mongoose';
import type { ProductBadge } from '../constants/index.ts';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    brand?: string;
    badge?: ProductBadge;
    category: Types.ObjectId;
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
