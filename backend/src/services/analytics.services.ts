import {
    CartModel,
    CategoryModel,
    OrderModel,
    ProductModel,
    ReviewModel,
    UserModel,
} from '../models/index.ts';
import { ANALYTICS_PERIOD_MS, TIME_MS } from '../constants/index.ts';
import type {
    AnalyticsPeriod,
    ICartAbandonmentAnalytics,
    ICategorySalesShare,
    ICountrySalesDistribution,
    IInventoryHealth,
    IMetricGrowth,
    IMetricSnapshot,
    IOperationsAnalytics,
    IOverviewKPIs,
    IProductAnalytics,
    IRestockAlertItem,
    ISalesTrendPoint,
    ITimeWindowComparison,
    ITopProduct,
    IVipCustomer,
    ServiceResult,
} from '../types/index.ts';

// ── 1. Helper to fetch single metric snapshot for any date window ──
const fetchMetricSnapshot = async (
    startDate: Date | null,
    endDate: Date | null = null,
): Promise<IMetricSnapshot> => {
    const orderMatch: Record<string, unknown> = {
        paymentStatus: 'paid',
        orderStatus: { $ne: 'cancelled' },
    };

    const userMatch: Record<string, unknown> = {
        role: 'user',
    };

    if (startDate && endDate) {
        orderMatch.createdAt = { $gte: startDate, $lt: endDate };
        userMatch.createdAt = { $gte: startDate, $lt: endDate };
    } else if (startDate) {
        orderMatch.createdAt = { $gte: startDate };
        userMatch.createdAt = { $gte: startDate };
    }

    const [orderStats, customerCount] = await Promise.all([
        OrderModel.aggregate<{ totalRevenue: number; ordersCount: number }>([
            { $match: orderMatch },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                    ordersCount: { $sum: 1 },
                },
            },
        ]),
        UserModel.countDocuments(userMatch),
    ]);

    const stats = orderStats[0] || { totalRevenue: 0, ordersCount: 0 };
    const revenue = Number(stats.totalRevenue.toFixed(2));
    const orders = stats.ordersCount;
    const aov = orders > 0 ? Number((revenue / orders).toFixed(2)) : 0;

    return {
        revenue,
        orders,
        customers: customerCount,
        averageOrderValue: aov,
    };
};

// ── 2. Safe Growth Rate Calculator (Prevents division by zero) ──
const calculateGrowthRate = (current: number, previous: number): number => {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }
    return Number((((current - previous) / previous) * 100).toFixed(1));
};

// ── 3. Helper to compute Growth object from Current & Previous snapshots ──
const calculateMetricGrowth = (
    current: IMetricSnapshot,
    previous: IMetricSnapshot,
): IMetricGrowth => {
    return {
        revenueGrowth: calculateGrowthRate(current.revenue, previous.revenue),
        ordersGrowth: calculateGrowthRate(current.orders, previous.orders),
        customersGrowth: calculateGrowthRate(current.customers, previous.customers),
        aovGrowth: calculateGrowthRate(current.averageOrderValue, previous.averageOrderValue),
    };
};

// ── 4. Helper to compare two sequential time windows ──
const compareTimeWindows = async (
    currentStart: Date,
    currentEnd: Date,
    previousStart: Date,
    previousEnd: Date,
): Promise<ITimeWindowComparison> => {
    const [current, previous] = await Promise.all([
        fetchMetricSnapshot(currentStart, currentEnd),
        fetchMetricSnapshot(previousStart, previousEnd),
    ]);

    const growth = calculateMetricGrowth(current, previous);

    return {
        current,
        previous,
        growth,
    };
};

// ── 5. Overview KPIs with DoD, WoW, MoM, and YoY Comparisons ──
export const getOverviewKPIs = async (): Promise<ServiceResult<IOverviewKPIs>> => {
    const now = new Date();
    const nowMs = now.getTime();

    // 24h Window: Current (0-24h ago), Previous (24h-48h ago) [Day-over-Day]
    const date24h = new Date(nowMs - TIME_MS.TWENTY_FOUR_HOURS);
    const date48h = new Date(nowMs - TIME_MS.FORTY_EIGHT_HOURS);

    // 7d Window: Current (0-7d ago), Previous (7d-14d ago) [Week-over-Week]
    const date7d = new Date(nowMs - TIME_MS.SEVEN_DAYS);
    const date14d = new Date(nowMs - TIME_MS.FOURTEEN_DAYS);

    // 30d Window: Current (0-30d ago), Previous (30d-60d ago) [Month-over-Month]
    const date30d = new Date(nowMs - TIME_MS.THIRTY_DAYS);
    const date60d = new Date(nowMs - TIME_MS.SIXTY_DAYS);

    // 1y Window: Current (0-365d ago), Previous (365d-730d ago) [Year-over-Year]
    const date1y = new Date(nowMs - TIME_MS.ONE_YEAR);
    const date2y = new Date(nowMs - TIME_MS.TWO_YEARS);

    const [last24Hours, last7Days, last30Days, last1Year, allTime] = await Promise.all([
        compareTimeWindows(date24h, now, date48h, date24h),
        compareTimeWindows(date7d, now, date14d, date7d),
        compareTimeWindows(date30d, now, date60d, date30d),
        compareTimeWindows(date1y, now, date2y, date1y),
        fetchMetricSnapshot(null, null),
    ]);

    return {
        statusCode: 200,
        data: {
            last24Hours,
            last7Days,
            last30Days,
            last1Year,
            allTime,
        },
        message: 'Overview KPIs and period-over-period growth calculated successfully',
    };
};

// ── Helper to convert AnalyticsPeriod to Date threshold ──
const getSinceDate = (period: AnalyticsPeriod): Date | null => {
    if (period === 'all') return null;
    const now = Date.now();
    return new Date(now - ANALYTICS_PERIOD_MS[period]);
};

// ── 2. Sales Trend Timeline for Charts (24h / 7d / 30d / 1y / all) ──
export const getSalesTrend = async (
    period: AnalyticsPeriod = '30d',
): Promise<ServiceResult<ISalesTrendPoint[]>> => {
    const matchStage: Record<string, unknown> = {
        paymentStatus: 'paid',
        orderStatus: { $ne: 'cancelled' },
    };

    const sinceDate = getSinceDate(period);
    if (sinceDate) {
        matchStage.createdAt = { $gte: sinceDate };
    }

    const trendData = await OrderModel.aggregate<{
        _id: string;
        revenue: number;
        orders: number;
    }>([
        {
            $match: matchStage,
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                revenue: { $sum: '$totalPrice' },
                orders: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    const formattedPoints: ISalesTrendPoint[] = trendData.map((pt) => ({
        date: pt._id,
        revenue: Number(pt.revenue.toFixed(2)),
        orders: pt.orders,
    }));

    return {
        statusCode: 200,
        data: formattedPoints,
        message: `Sales trend for ${period} fetched successfully`,
    };
};

// ── 3. Product & Category Performance ──
export const getProductAndCategoryAnalytics = async (
    period: AnalyticsPeriod = 'all',
): Promise<ServiceResult<IProductAnalytics>> => {
    const matchStage: Record<string, unknown> = {
        paymentStatus: 'paid',
        orderStatus: { $ne: 'cancelled' },
    };

    const sinceDate = getSinceDate(period);
    if (sinceDate) {
        matchStage.createdAt = { $gte: sinceDate };
    }

    // 3A. Top 5 Best-Selling Products
    const topProductsRaw = await OrderModel.aggregate<{
        _id: string;
        unitsSold: number;
        revenue: number;
        name: string;
        image?: string;
    }>([
        {
            $match: matchStage,
        },
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.product',
                unitsSold: { $sum: '$items.quantity' },
                revenue: {
                    $sum: { $multiply: ['$items.price', '$items.quantity'] },
                },
                name: { $first: '$items.name' },
                image: { $first: '$items.image' },
            },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
    ]);

    // Fetch product details for slugs and category names
    const topProductIds = topProductsRaw.map((p) => p._id);
    const populatedProducts = await ProductModel.find({ _id: { $in: topProductIds } })
        .populate<{ category: { name: string } }>('category', 'name')
        .lean();

    const prodDetailMap = new Map(populatedProducts.map((p) => [p._id.toString(), p]));

    const topSellingProducts: ITopProduct[] = topProductsRaw.map((p) => {
        const prod = prodDetailMap.get(p._id.toString());
        return {
            productId: p._id.toString(),
            name: p.name,
            slug: prod?.slug || '',
            image: p.image,
            categoryName: prod?.category?.name || 'Accessories',
            unitsSold: p.unitsSold,
            revenue: Number(p.revenue.toFixed(2)),
        };
    });

    // 3B. Category Revenue Distribution
    const categoryStatsRaw = await OrderModel.aggregate<{
        _id: string;
        totalRevenue: number;
        totalUnitsSold: number;
    }>([
        {
            $match: matchStage,
        },
        { $unwind: '$items' },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'productDoc',
            },
        },
        { $unwind: '$productDoc' },
        {
            $group: {
                _id: '$productDoc.category',
                totalRevenue: {
                    $sum: { $multiply: ['$items.price', '$items.quantity'] },
                },
                totalUnitsSold: { $sum: '$items.quantity' },
            },
        },
    ]);

    const allCategories = await CategoryModel.find().lean();
    const allCatMap = new Map(allCategories.map((c) => [c._id.toString(), c]));

    const totalStoreRevenue = categoryStatsRaw.reduce((sum, c) => sum + c.totalRevenue, 0);

    const categorySalesDistribution: ICategorySalesShare[] = categoryStatsRaw.map((c) => {
        const cat = allCatMap.get(c._id?.toString() || '');
        const share =
            totalStoreRevenue > 0
                ? Number(((c.totalRevenue / totalStoreRevenue) * 100).toFixed(1))
                : 0;

        return {
            categoryId: c._id?.toString() || '',
            categoryName: cat?.name || 'Uncategorized',
            slug: cat?.slug || '',
            totalRevenue: Number(c.totalRevenue.toFixed(2)),
            totalUnitsSold: c.totalUnitsSold,
            percentageShare: share,
        };
    });

    return {
        statusCode: 200,
        data: {
            topSellingProducts,
            categorySalesDistribution,
        },
        message: 'Product and category analytics fetched successfully',
    };
};

// ── 4. Inventory Health & Restock Alerts ──
export const getInventoryHealth = async (): Promise<ServiceResult<IInventoryHealth>> => {
    const products = await ProductModel.find({ isActive: true }).lean();

    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalWarehouseValuation = 0;
    const restockAlerts: IRestockAlertItem[] = [];

    for (const p of products) {
        const value = (p.discountPrice || p.price) * p.stock;
        totalWarehouseValuation += value;

        if (p.stock === 0) {
            outOfStockCount++;
            restockAlerts.push({
                productId: p._id.toString(),
                name: p.name,
                slug: p.slug,
                brand: p.brand,
                stock: p.stock,
                price: p.price,
            });
        } else if (p.stock <= 5) {
            lowStockCount++;
            restockAlerts.push({
                productId: p._id.toString(),
                name: p.name,
                slug: p.slug,
                brand: p.brand,
                stock: p.stock,
                price: p.price,
            });
        } else {
            inStockCount++;
        }
    }

    return {
        statusCode: 200,
        data: {
            inStockCount,
            lowStockCount,
            outOfStockCount,
            totalCatalogItems: products.length,
            totalWarehouseValuation: Number(totalWarehouseValuation.toFixed(2)),
            restockAlerts,
        },
        message: 'Inventory health analytics fetched successfully',
    };
};

// ── 5. Operations, VIP Customers & Store Review Rating ──
export const getOperationsAndCustomers = async (
    period: AnalyticsPeriod = 'all',
): Promise<ServiceResult<IOperationsAnalytics>> => {
    const matchStage: Record<string, unknown> = {
        paymentStatus: 'paid',
        orderStatus: { $ne: 'cancelled' },
    };

    const statusMatchStage: Record<string, unknown> = {};

    const sinceDate = getSinceDate(period);
    if (sinceDate) {
        matchStage.createdAt = { $gte: sinceDate };
        statusMatchStage.createdAt = { $gte: sinceDate };
    }

    // 5A. Order Status Pipeline
    const orderStatusesRaw = await OrderModel.aggregate<{ _id: string; count: number }>([
        ...(sinceDate ? [{ $match: statusMatchStage }] : []),
        {
            $group: {
                _id: '$orderStatus',
                count: { $sum: 1 },
            },
        },
    ]);

    const ordersByStatus = {
        delivered: 0,
        shipped: 0,
        processing: 0,
        pending: 0,
        cancelled: 0,
    };

    let totalOrders = 0;
    for (const s of orderStatusesRaw) {
        if (s._id in ordersByStatus) {
            ordersByStatus[s._id as keyof typeof ordersByStatus] = s.count;
        }
        totalOrders += s.count;
    }

    const fulfillmentRate =
        totalOrders > 0
            ? Number(((ordersByStatus.delivered / totalOrders) * 100).toFixed(1))
            : 0;
    const cancellationRate =
        totalOrders > 0
            ? Number(((ordersByStatus.cancelled / totalOrders) * 100).toFixed(1))
            : 0;

    // 5B. Top 5 VIP Customers
    const vipRaw = await OrderModel.aggregate<{
        _id: string;
        totalSpent: number;
        ordersCount: number;
        lastOrderDate: Date;
    }>([
        {
            $match: matchStage,
        },
        {
            $group: {
                _id: '$user',
                totalSpent: { $sum: '$totalPrice' },
                ordersCount: { $sum: 1 },
                lastOrderDate: { $max: '$createdAt' },
            },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
    ]);

    const vipUserIds = vipRaw.map((v) => v._id);
    const vipUsers = await UserModel.find({ _id: { $in: vipUserIds } }).lean();
    const userMap = new Map(vipUsers.map((u) => [u._id.toString(), u]));

    const vipCustomers: IVipCustomer[] = vipRaw.map((v) => {
        const u = userMap.get(v._id.toString());
        return {
            userId: v._id.toString(),
            fullName: u ? `${u.firstName} ${u.lastName}` : 'Guest Customer',
            email: u?.email || '',
            totalSpent: Number(v.totalSpent.toFixed(2)),
            ordersCount: v.ordersCount,
            lastOrderDate: v.lastOrderDate,
        };
    });

    // 5C. Review Sentiment & CSAT
    const reviewMatch: Record<string, unknown> = {};
    if (sinceDate) {
        reviewMatch.createdAt = { $gte: sinceDate };
    }
    const allReviews = await ReviewModel.find(reviewMatch).lean();
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;
    let verifiedCount = 0;

    for (const r of allReviews) {
        ratingSum += r.rating;
        if (r.rating in ratingBreakdown) {
            ratingBreakdown[r.rating as keyof typeof ratingBreakdown]++;
        }
        if (r.isVerifiedPurchase) {
            verifiedCount++;
        }
    }

    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(2)) : 0;
    const verifiedReviewRatio =
        totalReviews > 0 ? Number(((verifiedCount / totalReviews) * 100).toFixed(1)) : 0;

    return {
        statusCode: 200,
        data: {
            ordersByStatus,
            fulfillmentRate,
            cancellationRate,
            vipCustomers,
            reviewSentiment: {
                averageRating,
                totalReviews,
                verifiedReviewRatio,
                ratingBreakdown,
            },
        },
        message: `Operations and customer analytics (${period}) fetched successfully`,
    };
};

// ── 6. Geographic Country Sales Distribution ──
export const getGeographicDistribution = async (
    period: AnalyticsPeriod = 'all',
): Promise<ServiceResult<ICountrySalesDistribution[]>> => {
    const matchStage: Record<string, unknown> = {
        paymentStatus: 'paid',
        orderStatus: { $ne: 'cancelled' },
    };

    const sinceDate = getSinceDate(period);
    if (sinceDate) {
        matchStage.createdAt = { $gte: sinceDate };
    }

    const geoRaw = await OrderModel.aggregate<{
        _id: string;
        totalRevenue: number;
        ordersCount: number;
    }>([
        {
            $match: matchStage,
        },
        {
            $group: {
                _id: '$shippingAddress.country',
                totalRevenue: { $sum: '$totalPrice' },
                ordersCount: { $sum: 1 },
            },
        },
        { $sort: { totalRevenue: -1 } },
    ]);

    const totalStoreRevenue = geoRaw.reduce((sum, g) => sum + g.totalRevenue, 0);

    const countrySales: ICountrySalesDistribution[] = geoRaw.map((g) => ({
        country: g._id || 'Unknown',
        totalRevenue: Number(g.totalRevenue.toFixed(2)),
        ordersCount: g.ordersCount,
        percentageShare:
            totalStoreRevenue > 0
                ? Number(((g.totalRevenue / totalStoreRevenue) * 100).toFixed(1))
                : 0,
    }));

    return {
        statusCode: 200,
        data: countrySales,
        message: `Geographic sales distribution (${period}) fetched successfully`,
    };
};

// ── 7. Cart Abandonment Analytics ──
export const getCartAbandonmentAnalytics = async (): Promise<
    ServiceResult<ICartAbandonmentAnalytics>
> => {
    const [activeCarts, totalOrdersCount] = await Promise.all([
        CartModel.find({ 'items.0': { $exists: true } })
            .populate<{
                items: Array<{
                    product: { price: number; discountPrice?: number } | null;
                    quantity: number;
                }>;
            }>({
                path: 'items.product',
                select: 'price discountPrice',
            })
            .lean(),
        OrderModel.countDocuments({ paymentStatus: 'paid' }),
    ]);

    let potentialLostRevenue = 0;
    let totalItemsInCarts = 0;
    const nonEmptyCartsCount = activeCarts.length;

    for (const c of activeCarts) {
        for (const item of c.items) {
            const product = item.product;
            if (product) {
                const effectivePrice = product.discountPrice ?? product.price ?? 0;
                potentialLostRevenue += effectivePrice * (item.quantity || 1);
            }
            totalItemsInCarts += item.quantity || 1;
        }
    }

    const totalCartIntent = nonEmptyCartsCount + totalOrdersCount;
    const abandonmentRate =
        totalCartIntent > 0
            ? Number(((nonEmptyCartsCount / totalCartIntent) * 100).toFixed(1))
            : 0;

    const averageCartItemCount =
        nonEmptyCartsCount > 0
            ? Number((totalItemsInCarts / nonEmptyCartsCount).toFixed(1))
            : 0;

    return {
        statusCode: 200,
        data: {
            activeCartsCount: nonEmptyCartsCount,
            potentialLostRevenue: Number(potentialLostRevenue.toFixed(2)),
            abandonmentRate,
            averageCartItemCount,
        },
        message: 'Cart abandonment analytics fetched successfully',
    };
};
