export const USER_ROLES = ['user', 'admin'];
export type UserRole = (typeof USER_ROLES)[number];

export const PRODUCT_BADGES = [
    'New Arrival',
    'Best Seller',
    'Limited Edition',
    'Featured',
    'Sale',
    'Trending',
];
export type ProductBadge = (typeof PRODUCT_BADGES)[number];

export const PRODUCT_SORT_OPTIONS = [
    'newest',
    'oldest',
    'price_asc',
    'price_desc',
    'rating',
];
export type ProductSortOption = (typeof PRODUCT_SORT_OPTIONS)[number];

export const ORDER_STATUSES = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
    'pending',
    'paid',
    'failed',
    'refunded',
];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
