import express from 'express';

import {
    createProductReview,
    deleteReview,
    updateReview,
} from '../controllers/review.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { validateBody, validateParams } from '../middleware/validate.middleware.ts';
import { idParamsSchema } from '../validators/common.validators.ts';
import { createReviewSchema, updateReviewSchema } from '../validators/review.validators.ts';

const reviewRouter = express.Router();

reviewRouter.use(validateJWT);

reviewRouter.post(
    '/id', 
    validateBody(createReviewSchema), 
    createProductReview
)
reviewRouter.put(
    '/:id',
    validateParams(idParamsSchema),
    validateBody(updateReviewSchema),
    updateReview,
);
reviewRouter.delete(
    '/:id',
    validateParams(idParamsSchema),
    deleteReview,
);

export { reviewRouter };
