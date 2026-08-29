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
import { requireAdmin } from '../middleware/admin.middleware.ts';
import { validateBody, validateParams } from '../middleware/validate.middleware.ts';
import { idParamsSchema } from '../validators/common.validators.ts';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validators.ts';

const orderRouter = express.Router();

orderRouter.use(validateJWT);

// ── Protected Customer Order Routes ──
orderRouter.post('/', validateBody(createOrderSchema), createOrder);

orderRouter.get('/my', getMyOrders);

orderRouter.get('/:id', validateParams(idParamsSchema), getOrderById);

orderRouter.put('/:id/pay', validateParams(idParamsSchema), markOrderAsPaid);

// ── Protected Admin Order Routes ──
orderRouter.put('/:id/deliver', requireAdmin, validateParams(idParamsSchema), markOrderAsDelivered);

orderRouter.put(
    '/:id/status',
    requireAdmin,
    validateParams(idParamsSchema),
    validateBody(updateOrderStatusSchema),
    updateOrderStatus,
);

export { orderRouter };
