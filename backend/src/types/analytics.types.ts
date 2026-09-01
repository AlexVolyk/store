export interface IMetricSnapshot {
    revenue: number;
    orders: number;
    customers: number;
    averageOrderValue: number;
}

export interface IMetricGrowth {
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    aovGrowth: number;
}

export interface ITimeWindowComparison {
    current: IMetricSnapshot;
    previous: IMetricSnapshot;
    growth: IMetricGrowth;
}

export interface IOverviewKPIs {
    last24Hours: ITimeWindowComparison;
    last7Days: ITimeWindowComparison;
    last30Days: ITimeWindowComparison;
    last1Year: ITimeWindowComparison;
    allTime: IMetricSnapshot;
}

export interface ISalesTrendPoint {
    date: string;
    revenue: number;
    orders: number;
}

export interface ITopProduct {
    productId: string;
    name: string;
    slug: string;
    image?: string;
    categoryName: string;
    unitsSold: number;
    revenue: number;
}

export interface ICategorySalesShare {
    categoryId: string;
    categoryName: string;
    slug: string;
    totalRevenue: number;
    totalUnitsSold: number;
    percentageShare: number;
}

export interface IProductAnalytics {
    topSellingProducts: ITopProduct[];
    categorySalesDistribution: ICategorySalesShare[];
}

export interface IRestockAlertItem {
    productId: string;
    name: string;
    slug: string;
    brand?: string;
    stock: number;
    price: number;
}

export interface IInventoryHealth {
    inStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalCatalogItems: number;
    totalWarehouseValuation: number;
    restockAlerts: IRestockAlertItem[];
}

export interface IVipCustomer {
    userId: string;
    fullName: string;
    email: string;
    totalSpent: number;
    ordersCount: number;
    lastOrderDate: Date;
}

export interface IReviewSentimentSummary {
    averageRating: number;
    totalReviews: number;
    verifiedReviewRatio: number;
    ratingBreakdown: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export interface IOperationsAnalytics {
    ordersByStatus: {
        delivered: number;
        shipped: number;
        processing: number;
        pending: number;
        cancelled: number;
    };
    fulfillmentRate: number;
    cancellationRate: number;
    vipCustomers: IVipCustomer[];
    reviewSentiment: IReviewSentimentSummary;
}

export interface ICountrySalesDistribution {
    country: string;
    totalRevenue: number;
    ordersCount: number;
    percentageShare: number;
}

export interface ICartAbandonmentAnalytics {
    activeCartsCount: number;
    potentialLostRevenue: number;
    abandonmentRate: number;
    averageCartItemCount: number;
}
