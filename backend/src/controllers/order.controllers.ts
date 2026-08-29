import type { Request, Response } from 'express';

import { orderService } from '../services/index.ts';
import {
    canAccessOrder,
    getCurrentUserId,
    getValidateParamsId,
    isAdmin,
    sendForbidden,
    sendServiceResult,
} from '../utils/index.ts';
import { CreateOrderDTO, UpdateOrderStatusDTO } from '../validators/order.validators.ts';

export const createOrder = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const body = req.validatedBody as CreateOrderDTO;

    const result = await orderService.createOrder(userId, body);

    return sendServiceResult(res, result);
};

export const getMyOrders = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);

    const result = await orderService.getMyOrders(userId);

    return sendServiceResult(res, result);
};

export const getOrderById = async (req: Request, res: Response) => {
    const userId = getCurrentUserId(req);
    const id = getValidateParamsId(req);

    const result = await orderService.getOrderById(id);

    if (!result.data) {
        return sendServiceResult(res, result);
    }

    const orderOwnerId = result.data.user._id.toString();

    const isOwner = userId === orderOwnerId;
    const isAdmin = canAccessOrder(req, orderOwnerId);

    if (!isOwner && !isAdmin) {
        return sendForbidden(res);
    }

    return sendServiceResult(res, result);
};

export const markOrderAsPaid = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);

    const result = await orderService.markOrderAsPaid(id);

    if (!result.data) {
        return sendServiceResult(res, result);
    }

    if (!canAccessOrder(req, result.data.user.toString())) {
        return sendForbidden(res);
    }

    return sendServiceResult(res, result);
};

export const markOrderAsDelivered = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);

    if (!isAdmin(req)) {
        return sendForbidden(res);
    }

    const result = await orderService.markOrderAsDelivered(id);

    return sendServiceResult(res, result);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const id = getValidateParamsId(req);
    const body = req.validatedBody as UpdateOrderStatusDTO;

    if (!isAdmin(req)) {
        return sendForbidden(res);
    }

    const result = await orderService.updateOrderStatus(id, body);

    return sendServiceResult(res, result);
};
