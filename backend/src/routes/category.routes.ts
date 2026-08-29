import express from 'express'

import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory,
} from '../controllers/category.controllers.ts'
import { validateJWT } from '../middleware/validateJWT.middleware.ts'
import { requireAdmin } from '../middleware/admin.middleware.ts'
import { validateBody, validateParams } from '../middleware/validate.middleware.ts'
import { idOrSlugParamsSchema, idParamsSchema } from '../validators/common.validators.ts'
import { createCategorySchema, updateCategorySchema } from '../validators/category.validators.ts'

const categoryRouter = express.Router()

// ── Public Category Routes ──
categoryRouter.get(
    '/',
    getCategories
)

categoryRouter.get(
    '/:id',
    validateParams(idOrSlugParamsSchema),
    getCategoryById
)

// ── Protected Admin Category Routes ──
categoryRouter.use(validateJWT, requireAdmin)

categoryRouter.post(
    '/',
    validateBody(createCategorySchema),
    createCategory
)

categoryRouter.put(
    '/:id',
    validateParams(idParamsSchema),
    validateBody(updateCategorySchema),
    updateCategory
)

categoryRouter.delete(
    '/:id',
    validateParams(idParamsSchema),
    deleteCategory
)

export { categoryRouter }
