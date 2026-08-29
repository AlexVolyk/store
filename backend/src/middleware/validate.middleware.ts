import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validateBody = (schema: ZodType, message = 'Validation failed') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400)
.json({
                message,
                errors: result.error.issues,
            });
        }

        // req.body = result.data;
        req.validatedBody = result.data;

        next();
    };
};

export const validateParams = (schema: ZodType, message = 'Invalid request parameters') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            return res.status(400)
.json({
                success: false,
                message,
                errors: result.error.issues,
            });
        }
        // req.params = result.data;

        req.validatedParams = result.data;

        next();
    };
};

export const validateQuery = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return res.status(400)
.json({
                success: false,
                message: 'Invalid query parameters',
                errors: result.error.issues,
            });
        }

        req.validatedQuery = result.data;

        next();
    };
};
