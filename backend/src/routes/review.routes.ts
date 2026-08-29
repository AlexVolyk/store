import express from 'express'

import {
    createProductReview,
    deleteReview,
    getProductReviews,
    updateReview,
} from '../controllers/review.controllers.ts'
import { validateJWT } from '../middleware/validateJWT.middleware.ts'
import { validateBody, validateParams } from '../middleware/validate.middleware.ts'
import { idParamsSchema, productIdParamsSchema } from '../validators/common.validators.ts'
import { createReviewSchema, updateReviewSchema } from '../validators/review.validators.ts'

const reviewRouter = express.Router()

// ── Public Product Reviews Route ──
reviewRouter.get(
    '/:productId',
    validateParams(productIdParamsSchema),
    getProductReviews
)

// ── Protected Review Mutation Routes ──
reviewRouter.use(validateJWT)

reviewRouter.post(
    '/:productId',
    validateParams(productIdParamsSchema),
    validateBody(createReviewSchema),
    createProductReview
)

reviewRouter.put(
    '/:id',
    validateParams(idParamsSchema),
    validateBody(updateReviewSchema),
    updateReview
)

reviewRouter.delete(
    '/:id',
    validateParams(idParamsSchema),
    deleteReview
)

export { reviewRouter }
