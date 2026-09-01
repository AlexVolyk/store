import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.ts';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.ts';
import { generalRateLimiter } from './middleware/rateLimit.middleware.ts';
import {
    analyticsRouter,
    authRouter,
    cartRouter,
    categoryRouter,
    orderRouter,
    productRouter,
    reviewRouter,
    userRouter,
    wishlistRouter,
} from './routes/index.ts';

export const app = express();

app.use(helmet());
app.use(
    cors({
        origin: env.clientUrl,
        credentials: true,
    }),
);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Global API Rate Limiter (Redis-backed with In-Memory fallback) ──
app.use('/api', generalRateLimiter);

// ── API Resource Routes ──
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin/analytics', analyticsRouter);

app.get('/api/health', (_req, res) => {
    res.status(200)
.json({
        success: true,
        message: 'Server is running',
    });
});

app.use(notFoundHandler);
app.use(errorHandler);
