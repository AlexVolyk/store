import type { Request, Response } from 'express';

import { wishlistService } from '../services/index.ts';
import { getCurrentUserId, getValidateParamsProductId, sendServiceResult } from '../utils/index.ts';

export const getWishlist = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const result = await wishlistService.getWishlist(userId);

    return sendServiceResult(res, result);
};

export const addWishlistProduct = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const productId = getValidateParamsProductId(req);

    const result = await wishlistService.addWishlistProduct(userId, productId);

    return sendServiceResult(res, result);
};

export const deleteWishlistProduct = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const productId = getValidateParamsProductId(req);

    const result = await wishlistService.deleteWishlistProduct(userId, productId);

    return sendServiceResult(res, result);
};
