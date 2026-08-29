import { db } from '../config/db.ts';
import { IReview } from '../types/index.ts';

const ReviewSchema = new db.Schema<IReview>(
    {
        user: {
            type: db.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        product: {
            type: db.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            index: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// One user can only write one review per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const ReviewModel = db.model('Review', ReviewSchema);
