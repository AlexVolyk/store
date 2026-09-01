import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis.ts';
import { env } from '../config/env.ts';

export const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store:
        redis.isOpen && env.nodeEnv !== 'test'
            ? new RedisStore({
                sendCommand: (...args: string[]) => redis.sendCommand(args),
            })
            : undefined,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
});
