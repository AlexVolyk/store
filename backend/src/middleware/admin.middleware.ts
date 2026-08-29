import type { NextFunction, Request, Response } from 'express';
import { sendForbidden, sendUnauthorized } from '../utils/controller.utils.ts';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return sendUnauthorized(res);
    }

    if (req.user.role !== 'admin') {
        return sendForbidden(res);
    }

    next();
};
