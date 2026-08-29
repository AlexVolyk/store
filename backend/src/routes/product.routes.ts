import express from 'express';

import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from '../controllers/product.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { requireAdmin } from '../middleware/admin.middleware.ts';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.middleware.ts';
import { idOrSlugParamsSchema, idParamsSchema } from '../validators/common.validators.ts';
import {
    createProductSchema,
    productQuerySchema,
    updateProductSchema,
} from '../validators/product.validators.ts';
import { CACHE_TTL } from '../constants/index.ts';
import { cacheMiddleware } from '../middleware/cache.middleware.ts';

const productRouter = express.Router();

// ── Public Product Discovery Routes ──
productRouter.get(
    '/',
    cacheMiddleware(CACHE_TTL.PRODUCTS),
    validateQuery(productQuerySchema),
    getProducts
);

productRouter.get(
    '/:id',
    cacheMiddleware(CACHE_TTL.PRODUCTS),
    validateParams(idOrSlugParamsSchema),
    getProductById
);

// ── Protected Admin Product Routes ──
productRouter.use(validateJWT, requireAdmin);

productRouter.post('/', validateBody(createProductSchema), createProduct);

productRouter.put(
    '/:id',
    validateParams(idParamsSchema),
    validateBody(updateProductSchema),
    updateProduct,
);

productRouter.delete('/:id', validateParams(idParamsSchema), deleteProduct);

export { productRouter };
