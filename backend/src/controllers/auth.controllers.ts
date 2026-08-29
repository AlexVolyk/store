import type { Request, Response } from 'express';

import { authService } from '../services/index.ts';
import { sendServiceResult } from '../utils/index.ts';
import { RegisterUserDTO, LoginUserDTO } from '../validators/auth.validators.ts';

export const register = async (req: Request, res: Response) => {
    const body = req.validatedBody as RegisterUserDTO;
    const result = await authService.registerUser(body);

    return sendServiceResult(res, result);
};

export const login = async (req: Request, res: Response) => {
    const body = req.validatedBody as LoginUserDTO;
    const result = await authService.loginUser(body);

    return sendServiceResult(res, result);
};
