import express from 'express';

import {
    allUsers,
    deleteUser,
    getMe,
    getUserById,
    updateMe,
    updateUser,
} from '../controllers/user.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { requireAdmin } from '../middleware/admin.middleware.ts';
import { validateBody, validateParams } from '../middleware/validate.middleware.ts';
import { idParamsSchema } from '../validators/common.validators.ts';
import { updateUserSchema } from '../validators/user.validator.ts';

const userRouter = express.Router();

userRouter.use(validateJWT);

// ── Authenticated User Self-Service Endpoints ──
userRouter.get('/me', getMe);

userRouter.put('/me', validateBody(updateUserSchema), updateMe);

// ── Admin / User Management Endpoints ──
userRouter.get('/', requireAdmin, allUsers);

userRouter.get('/:id', validateParams(idParamsSchema), getUserById);

userRouter.put('/:id', validateParams(idParamsSchema), validateBody(updateUserSchema), updateUser);

userRouter.delete('/:id', requireAdmin, validateParams(idParamsSchema), deleteUser);

export { userRouter };
