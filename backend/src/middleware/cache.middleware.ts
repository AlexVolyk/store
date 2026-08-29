import type { NextFunction, Request, Response } from 'express';
import { redis } from '../config/redis.ts';

export const cacheMiddleware = (ttlSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!redis.isOpen) {
            return next();
        }

        const cacheKey = `cache:${req.originalUrl}`;

        try {
            const cachedBody = await redis.get(cacheKey);
            
            if (cachedBody) {
                res.setHeader('X-Cache', 'HIT');

                return res.status(200).json(JSON.parse(cachedBody));
            }

            res.setHeader('X-Cache', 'MISS');
            const originalJson = res.json.bind(res);

            res.json = (body: unknown) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redis.set(cacheKey, JSON.stringify(body), {
                        EX: ttlSeconds,
                    });
                }

                return originalJson(body);
            };

            next();
        } catch (error) {
            console.warn('[Cache Error]:', error);
            next();
        }
    };
};
