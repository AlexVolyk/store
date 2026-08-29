import type { Request, Response } from 'express';

import * as cartService from '../services/cart.services.ts';
import { getCurrentUserId, getValidateParamsProductId, sendServiceResult } from '../utils/index.ts';
import { AddCartItemDTO, UpdateCartItemDTO } from '../validators/cart.validators.ts';

export const getCart = async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const result = await cartService.getCart(userId);

        return sendServiceResult(res, result);
};

export const addCartItem = async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const body = req.validatedBody as AddCartItemDTO

        const result = await cartService.addCartItem(userId, body);

        return sendServiceResult(res, result);
};

export const updateCartItem = async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const productId = getValidateParamsProductId(req)
        const body = req.validatedBody as UpdateCartItemDTO

        const result = await cartService.updateCartItem(userId, productId, body);

        return sendServiceResult(res, result);
};

export const deleteCartItem = async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const productId = getValidateParamsProductId(req)

        const result = await cartService.deleteCartItem(userId, productId);

        return sendServiceResult(res, result);
};

export const clearCart = async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const result = await cartService.clearCart(userId);

        return sendServiceResult(res, result);
};
