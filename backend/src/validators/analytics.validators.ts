import { z } from 'zod';
import { ANALYTICS_PERIODS } from '../constants/index.ts';

export const analyticsPeriodQuerySchema = z.object({
    period: z
        .enum(ANALYTICS_PERIODS)
        .optional()
        .default('all'),
});

export const salesTrendQuerySchema = z.object({
    period: z
        .enum(ANALYTICS_PERIODS)
        .optional()
        .default('30d'),
});

export type AnalyticsPeriodQueryDTO = z.infer<typeof analyticsPeriodQuerySchema>;
export type SalesTrendQueryDTO = z.infer<typeof salesTrendQuerySchema>;

