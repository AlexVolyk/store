import express from 'express';

import {
    createOrder,
    getMyOrders,
    getOrderById,
    markOrderAsDelivered,
    markOrderAsPaid,
    updateOrderStatus,
} from '../controllers/order.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { validateParams, validateBody } from '../middleware/validate.middleware.ts';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validators.ts';
import { idParamsSchema } from '../validators/common.validators.ts';

const orderRouter = express.Router();

orderRouter.use(validateJWT);

orderRouter.post(
    '/', 
    validateBody(createOrderSchema), 
    createOrder
);
orderRouter.get(
    '/my', 
    getMyOrders
);
orderRouter.get(
    '/:id', 
    validateParams(idParamsSchema),
    getOrderById
);
orderRouter.put(
    '/:id/pay', 
    validateParams(idParamsSchema),
    markOrderAsPaid
);
orderRouter.put(
    '/:id/deliver',
    validateParams(idParamsSchema),
    markOrderAsDelivered
);
orderRouter.put(
    '/:id/status', 
    validateParams(idParamsSchema),
    validateBody(updateOrderStatusSchema), 
    updateOrderStatus
);

export { orderRouter };
