import type { Document, Types } from 'mongoose';

export interface IReview extends Document {
    user: Types.ObjectId;
    product: Types.ObjectId;
    rating: number;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: Date;
    updatedAt: Date;
}
