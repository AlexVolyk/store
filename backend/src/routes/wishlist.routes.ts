import express from 'express';

import {
    addWishlistProduct,
    deleteWishlistProduct,
    getWishlist,
} from '../controllers/wishlist.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { validateParams } from '../middleware/validate.middleware.ts';
import { productIdParamsSchema } from '../validators/common.validators.ts';

const wishlistRouter = express.Router();

// ── Protected Wishlist Routes ──
wishlistRouter.use(validateJWT);

wishlistRouter.get('/', getWishlist);

wishlistRouter.post('/:productId', validateParams(productIdParamsSchema), addWishlistProduct);

wishlistRouter.delete('/:productId', validateParams(productIdParamsSchema), deleteWishlistProduct);

export { wishlistRouter };
