import type { Request, Response } from 'express';
import { analyticsService } from '../services/index.ts';
import {
    getValidateAnalyticsPeriodQuery,
    getValidateSalesTrendQuery,
    sendServiceResult,
} from '../utils/index.ts';

export const getOverviewKPIs = async (_req: Request, res: Response) => {
    const result = await analyticsService.getOverviewKPIs();
    return sendServiceResult(res, result);
};

export const getSalesTrend = async (req: Request, res: Response) => {
    const period = getValidateSalesTrendQuery(req);
    const result = await analyticsService.getSalesTrend(period);

    return sendServiceResult(res, result);
};

export const getProductAnalytics = async (req: Request, res: Response) => {
    const period = getValidateAnalyticsPeriodQuery(req);
    const result = await analyticsService.getProductAndCategoryAnalytics(period);

    return sendServiceResult(res, result);
};

export const getInventoryHealth = async (_req: Request, res: Response) => {
    const result = await analyticsService.getInventoryHealth();
    return sendServiceResult(res, result);
};

export const getOperationsAndCustomers = async (req: Request, res: Response) => {
    const period = getValidateAnalyticsPeriodQuery(req);
    const result = await analyticsService.getOperationsAndCustomers(period);

    return sendServiceResult(res, result);
};

export const getGeographicDistribution = async (req: Request, res: Response) => {
    const period = getValidateAnalyticsPeriodQuery(req);
    const result = await analyticsService.getGeographicDistribution(period);

    return sendServiceResult(res, result);
};

export const getCartAbandonmentAnalytics = async (_req: Request, res: Response) => {
    const result = await analyticsService.getCartAbandonmentAnalytics();
    return sendServiceResult(res, result);
};
