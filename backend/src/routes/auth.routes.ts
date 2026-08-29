import express from 'express';

import { login, register } from '../controllers/auth.controllers.ts';
import { validateBody } from '../middleware/validate.middleware.ts';
import { loginSchema, registerSchema } from '../validators/auth.validators.ts';

const authRouter = express.Router();

// ── Public Authentication Routes ──
authRouter.post('/register', validateBody(registerSchema), register);

authRouter.post('/login', validateBody(loginSchema), login);

export { authRouter };
