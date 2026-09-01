export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PRODUCT_BADGES = [
    'New Arrival',
    'Best Seller',
    'Limited Edition',
    'Featured',
    'Sale',
    'Trending',
] as const;
export type ProductBadge = (typeof PRODUCT_BADGES)[number];

export const PRODUCT_SORT_OPTIONS = [
    'newest',
    'oldest',
    'price_asc',
    'price_desc',
    'rating',
] as const;
export type ProductSortOption = (typeof PRODUCT_SORT_OPTIONS)[number];

export const ORDER_STATUSES = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
    'pending',
    'paid',
    'failed',
    'refunded',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const CACHE_TTL = {
    ONE_MINUTE: 60,
    FIVE_MINUTES: 5 * 60,
    TEN_MINUTES: 10 * 60,
    ONE_HOUR: 60 * 60,
    ONE_DAY: 24 * 60 * 60,
    PRODUCTS: 5 * 60, // 5 minutes
    CATEGORIES: 60 * 60, // 1 hour
    ANALYTICS: 5 * 60, // 5 minutes
} as const;

export const ANALYTICS_PERIODS = ['24h', '7d', '30d', '1y', 'all'] as const;
export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number];

export const TIME_MS = {
    ONE_HOUR: 60 * 60 * 1000,
    TWENTY_FOUR_HOURS: 24 * 60 * 60 * 1000,
    FORTY_EIGHT_HOURS: 48 * 60 * 60 * 1000,
    SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
    FOURTEEN_DAYS: 14 * 24 * 60 * 60 * 1000,
    THIRTY_DAYS: 30 * 24 * 60 * 60 * 1000,
    SIXTY_DAYS: 60 * 24 * 60 * 60 * 1000,
    ONE_YEAR: 365 * 24 * 60 * 60 * 1000,
    TWO_YEARS: 730 * 24 * 60 * 60 * 1000,
} as const;

export const ANALYTICS_PERIOD_MS: Record<Exclude<AnalyticsPeriod, 'all'>, number> = {
    '24h': TIME_MS.TWENTY_FOUR_HOURS,
    '7d': TIME_MS.SEVEN_DAYS,
    '30d': TIME_MS.THIRTY_DAYS,
    '1y': TIME_MS.ONE_YEAR,
} as const;


