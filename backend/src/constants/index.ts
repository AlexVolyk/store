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
} as const;

