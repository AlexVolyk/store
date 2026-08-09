import express from 'express';

import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory,
} from '../controllers/category.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { validateParams, validateBody } from '../middleware/validate.middleware.ts';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validators.ts';
import { idParamsSchema } from '../validators/common.validators.ts';

const categoryRouter = express.Router();

categoryRouter.get(
    '/', 
    getCategories
);
categoryRouter.get(
    '/:id', 
    validateParams(idParamsSchema),
    getCategoryById
);


categoryRouter.use(validateJWT)


categoryRouter.post(
    '/', 
    validateBody(createCategorySchema), 
    createCategory)
    ;
categoryRouter.put(
    '/:id', 
    validateParams(idParamsSchema),
    validateBody(updateCategorySchema), 
    updateCategory
);
categoryRouter.delete(
    '/:id', 
    validateParams(idParamsSchema),
    deleteCategory
);

export { categoryRouter };
