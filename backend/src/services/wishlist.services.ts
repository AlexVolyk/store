import { ProductModel, WishlistModel } from '../models/index.ts';
import { ServiceResult } from '../types/service.types.ts';

export const getWishlist = async (userId: string): Promise<ServiceResult> => {
    const wishlist = await WishlistModel.findOne({
        user: userId,
    })
.populate('products');

    return {
        statusCode: 200,
        data: wishlist ?? {
            user: userId,
            products: [],
        },
        message: 'Wishlist fetched successfully',
    };
};

export const addWishlistProduct = async (
    userId: string,
    productId: string,
): Promise<ServiceResult> => {
    const product = await ProductModel.findById(productId);

    if (!product) {
        return {
            statusCode: 404,
            message: 'Product not found',
        };
    }

    const existingWishlist = await WishlistModel.findOne({
        user: userId,
        products: product._id,
    });

    if (existingWishlist) {
        return {
            statusCode: 409,
            message: 'Product is already in wishlist',
        };
    }

    const wishlist = await WishlistModel.findOneAndUpdate(
        { user: userId },
        {
            $setOnInsert: {
                user: userId,
            },
            $addToSet: {
                products: product._id,
            },
        },
        {
            new: true,
            upsert: true,
        },
    )
.populate('products');

    return {
        statusCode: 200,
        data: wishlist,
        message: 'Product added to wishlist successfully',
    };
};

export const deleteWishlistProduct = async (
    userId: string,
    productId: string,
): Promise<ServiceResult> => {
    const wishlist = await WishlistModel.findOneAndUpdate(
        { user: userId },
        {
            $pull: {
                products: productId,
            },
        },
        {
            new: true,
        },
    )
.populate('products');

    if (!wishlist) {
        return {
            statusCode: 404,
            message: 'Wishlist not found',
        };
    }

    return {
        statusCode: 200,
        data: wishlist,
        message: 'Product removed from wishlist successfully',
    };
};
