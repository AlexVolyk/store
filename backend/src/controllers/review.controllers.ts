import type { Request, Response } from "express";

import { reviewService } from "../services/index.ts";
import { getCurrentUserId, getValidateParamsId, getValidateParamsProductId, sendServiceResult } from "../utils/index.ts";
import { CreateReviewDTO, UpdateReviewDTO } from '../validators/review.validators.ts';

export const getProductReviews = async (req: Request, res: Response) => {
    const productId = getValidateParamsProductId(req);

    const result = await reviewService.getProductReviews(productId);

    return sendServiceResult(res, result);
};

export const createProductReview = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const productId = getValidateParamsProductId(req);
    const body = req.validatedBody as CreateReviewDTO;

    const result = await reviewService.createProductReview(
        userId,
        productId,
        body
    );

    return sendServiceResult(res, result);
};

export const updateReview = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const id = getValidateParamsId(req);
    const body = req.validatedBody as UpdateReviewDTO;

    const result = await reviewService.updateReview(
        id,
        userId,
        req.user?.role,
        body,
    );

    return sendServiceResult(res, result);
};

export const deleteReview = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const id = getValidateParamsId(req);

    const result = await reviewService.deleteReview(
        id,
        userId,
        req.user?.role,
    );

    return sendServiceResult(res, result);
};
