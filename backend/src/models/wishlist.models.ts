import { db } from '../config/db.ts';
import { IWishlist } from '../types/index.ts';

const WishlistSchema = new db.Schema<IWishlist>(
    {
        user: {
            type: db.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        products: {
            type: [
                {
                    type: db.Schema.Types.ObjectId,
                    ref: 'Product',
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export const WishlistModel = db.model('Wishlist', WishlistSchema);
