import express from 'express';

import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from '../controllers/product.controllers.ts';
import { createProductReview } from '../controllers/review.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { validateParams, validateBody, validateQuery } from '../middleware/validate.middleware.ts';
import { createProductSchema, productQuerySchema, updateProductSchema } from '../validators/product.validators.ts';
import { idParamsSchema, productIdParamsSchema } from '../validators/common.validators.ts';
import { createReviewSchema } from '../validators/review.validators.ts';

const productRouter = express.Router();

productRouter.get(
    '/', 
    validateQuery(productQuerySchema),
    getProducts
);
productRouter.get(
    '/:id',
    validateParams(idParamsSchema),
    getProductById
);

productRouter.use(validateJWT);

productRouter.post(
    '/', 
    validateBody(createProductSchema),
    createProduct
);
productRouter.put(
    '/:id', 
    validateParams(idParamsSchema),
    validateBody(updateProductSchema),
    updateProduct
);
productRouter.delete(
    '/:id', 
    validateParams(idParamsSchema),
    deleteProduct
);
productRouter.post(
    '/:productId/reviews',
    validateParams(productIdParamsSchema),
    validateBody(createReviewSchema),
    createProductReview,
);

export { productRouter };
