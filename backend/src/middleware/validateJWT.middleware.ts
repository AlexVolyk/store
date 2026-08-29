import type { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/index.ts';
import { verifyToken } from '../utils/token.utils.ts';
import { invalidToken, sendUnauthorized } from '../utils/controller.utils.ts';

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return sendUnauthorized(res);
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return sendUnauthorized(res);
    }

    const payload = verifyToken(token);
    if (!payload) {
        return invalidToken(res);
    }

    const user = await UserModel.findById(payload.id);
    if (!user) {
        return sendUnauthorized(res);
    }

    req.user = user;
    next();
};
