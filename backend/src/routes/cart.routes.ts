import express from 'express';

import {
    addCartItem,
    clearCart,
    deleteCartItem,
    getCart,
    updateCartItem,
} from '../controllers/cart.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { validateBody, validateParams } from '../middleware/validate.middleware.ts';
import { productIdParamsSchema } from '../validators/common.validators.ts';
import { addCartItemSchema, updateCartItemSchema } from '../validators/cart.validators.ts';

const cartRouter = express.Router();

// ── Protected Cart Routes ──
cartRouter.use(validateJWT);

cartRouter.get('/', getCart);

cartRouter.post('/items', validateBody(addCartItemSchema), addCartItem);

cartRouter.patch(
    '/items/:productId',
    validateParams(productIdParamsSchema),
    validateBody(updateCartItemSchema),
    updateCartItem,
);

cartRouter.delete('/items/:productId', validateParams(productIdParamsSchema), deleteCartItem);

cartRouter.delete('/', clearCart);

export { cartRouter };
