import express from 'express';

import {
    getCartAbandonmentAnalytics,
    getGeographicDistribution,
    getInventoryHealth,
    getOperationsAndCustomers,
    getOverviewKPIs,
    getProductAnalytics,
    getSalesTrend,
} from '../controllers/analytics.controllers.ts';
import { validateJWT } from '../middleware/validateJWT.middleware.ts';
import { requireAdmin } from '../middleware/admin.middleware.ts';
import { validateQuery } from '../middleware/validate.middleware.ts';
import {
    analyticsPeriodQuerySchema,
    salesTrendQuerySchema,
} from '../validators/analytics.validators.ts';
import { CACHE_TTL } from '../constants/index.ts';
import { cacheMiddleware } from '../middleware/cache.middleware.ts';

const analyticsRouter = express.Router();

// ── All Analytics Endpoints Protected by Admin Guards + Redis Caching (5m TTL) ──
analyticsRouter.use(
    validateJWT,
    requireAdmin,
    cacheMiddleware(CACHE_TTL.ANALYTICS),
);

// 1. Overview KPIs (24h / 7d / 30d / 1y / All-Time)
analyticsRouter.get('/overview', getOverviewKPIs);

// 2. Sales Trend Daily Chart Points (?period=24h | 7d | 30d | 1y | all)
analyticsRouter.get(
    '/sales-trend',
    validateQuery(salesTrendQuerySchema),
    getSalesTrend,
);

// 3. Products & Category Revenue Share (?period=24h | 7d | 30d | 1y | all)
analyticsRouter.get(
    '/products',
    validateQuery(analyticsPeriodQuerySchema),
    getProductAnalytics,
);

// 4. Stock Health & Restock Alerts (Live snapshot)
analyticsRouter.get('/inventory', getInventoryHealth);

// 5. Operations, VIP Customers & Review Rating (?period=24h | 7d | 30d | 1y | all)
analyticsRouter.get(
    '/operations',
    validateQuery(analyticsPeriodQuerySchema),
    getOperationsAndCustomers,
);

// 6. Geographic Country Breakdown (?period=24h | 7d | 30d | 1y | all)
analyticsRouter.get(
    '/geography',
    validateQuery(analyticsPeriodQuerySchema),
    getGeographicDistribution,
);

// 7. Cart Abandonment Intelligence (Live snapshot)
analyticsRouter.get('/cart-abandonment', getCartAbandonmentAnalytics);

export { analyticsRouter };
