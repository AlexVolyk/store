import { Types } from "mongoose";

import { ProductModel, ReviewModel } from "../models/index.ts";
import type {
    CreateReviewDTO,
    UpdateReviewDTO,
} from "../validators/review.validators.ts";
import { ServiceResult } from "../types/service.types.ts";

const updateProductRating = async (productId: string) => {
    const result = await ReviewModel.aggregate<{
        averageRating: number;
        reviewCount: number;
    }>([
        {
            $match: {
                product: new Types.ObjectId(productId),
            },
        },
        {
            $group: {
                _id: "$product",
                averageRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    const stats = result[0] ?? {
        averageRating: 0,
        reviewCount: 0,
    };

    await ProductModel.findByIdAndUpdate(productId, {
        averageRating: Number(stats.averageRating.toFixed(1)),
        reviewCount: stats.reviewCount,
    });
};




export const createProductReview = async (
    userId: string,
    productId: string,
    reviewDTO: CreateReviewDTO,
): Promise<ServiceResult> => {
    const product = await ProductModel.findById(productId);

    if (!product) {
        return {
            statusCode: 404,
            message: "Product not found",
        };
    }

    const existingReview = await ReviewModel.findOne({
        user: userId,
        product: productId,
    });

    if (existingReview) {
        return {
            statusCode: 409,
            message: "You have already reviewed this product",
        };
    }

    const review = await ReviewModel.create({
        ...reviewDTO,
        user: userId,
        product: productId,
    });

    await updateProductRating(productId);

    return {
        statusCode: 201,
        data: review,
        message: "Review created successfully",
    };
};

export const updateReview = async (
    reviewId: string,
    userId: string,
    userRole: string | undefined,
    reviewDTO: UpdateReviewDTO,
): Promise<ServiceResult> => {
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
        return {
            statusCode: 404,
            message: "Review not found",
        };
    }

    const isOwner = review.user.toString() === userId.toString();

    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
        return {
            statusCode: 403,
            message: "You do not have permission to update this review",
        };
    }

    if (reviewDTO.rating !== undefined) {
        review.rating = reviewDTO.rating;
    }

    if (reviewDTO.comment !== undefined) {
        review.comment = reviewDTO.comment.trim();
    }

    await review.save();

    await updateProductRating(review.product.toString(),);

    return {
        statusCode: 200,
        data: review,
        message: "Review updated successfully",
    };
};

export const deleteReview = async (
    reviewId: string,
    userId: string,
    userRole: string | undefined,
): Promise<ServiceResult> => {
    const review = await ReviewModel.findById(reviewId);

    if (!review) {
        return {
            statusCode: 404,
            message: "Review not found",
        };
    }

    const isOwner = review.user.toString() === userId.toString();

    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
        return {
            statusCode: 403,
            message: "You do not have permission to delete this review",
        };
    }

    const productId = review.product.toString();

    await review.deleteOne();

    await updateProductRating(productId);

    return {
        statusCode: 200,
        data: review,
        message: "Review deleted successfully",
    };
};