import express from 'express'

import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from '../controllers/product.controllers.ts'
import { validateJWT } from '../middleware/validateJWT.middleware.ts'
import { requireAdmin } from '../middleware/admin.middleware.ts'
import { validateBody, validateParams, validateQuery } from '../middleware/validate.middleware.ts'
import { idOrSlugParamsSchema, idParamsSchema } from '../validators/common.validators.ts'
import { createProductSchema, productQuerySchema, updateProductSchema } from '../validators/product.validators.ts'

const productRouter = express.Router()

// ── Public Product Discovery Routes ──
productRouter.get(
    '/',
    validateQuery(productQuerySchema),
    getProducts
)

productRouter.get(
    '/:id',
    validateParams(idOrSlugParamsSchema),
    getProductById
)

// ── Protected Admin Product Routes ──
productRouter.use(validateJWT, requireAdmin)

productRouter.post(
    '/',
    validateBody(createProductSchema),
    createProduct
)

productRouter.put(
    '/:id',
    validateParams(idParamsSchema),
    validateBody(updateProductSchema),
    updateProduct
)

productRouter.delete(
    '/:id',
    validateParams(idParamsSchema),
    deleteProduct
)

export { productRouter }
