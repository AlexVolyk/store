import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { getToken } from '../src/utils/token.utils.ts';
import {
    clearTestDatabase,
    createTestCategory,
    createTestOrder,
    createTestProduct,
    createTestUser,
} from './helpers/testSeeds.ts';

describe('Admin Analytics API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe('GET /api/admin/analytics/overview', () => {
        it('should return DoD, WoW, MoM, YoY comparisons and all-time KPIs for admin', async () => {
            const { user: customer } = await createTestUser('user', 'customer_stat@test.com');
            const { token: adminToken } = await createTestUser('admin', 'admin_stat@test.com');
            const category = await createTestCategory('Audio');
            const product = await createTestProduct(category._id.toString(), { price: 300 });

            // Seed paid order
            await createTestOrder(customer._id.toString(), product._id.toString(), {
                totalPrice: 300,
                paymentStatus: 'paid',
            });

            const response = await request(app)
                .get('/api/admin/analytics/overview')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('last24Hours');
            expect(response.body.data).toHaveProperty('last7Days');
            expect(response.body.data).toHaveProperty('last30Days');
            expect(response.body.data).toHaveProperty('last1Year');
            expect(response.body.data).toHaveProperty('allTime');

            expect(response.body.data.last24Hours.current.revenue).toBe(300);
            expect(response.body.data.last24Hours.current.orders).toBe(1);
            expect(response.body.data.last24Hours.growth.revenueGrowth).toBeDefined();
        });

        it('should handle zero-state (empty store) gracefully with 0s and no NaN', async () => {
            const { token: adminToken } = await createTestUser('admin', 'empty_admin@test.com');

            const response = await request(app)
                .get('/api/admin/analytics/overview')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.allTime.revenue).toBe(0);
            expect(response.body.data.allTime.orders).toBe(0);
            expect(response.body.data.last30Days.growth.revenueGrowth).toBe(0);
        });

        it('should reject non-admin users with 403 Forbidden', async () => {
            const { token: userToken } = await createTestUser('user', 'intruder@test.com');

            const response = await request(app)
                .get('/api/admin/analytics/overview')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body.message).toContain('Access denied');
        });
    });

    describe('GET /api/admin/analytics/sales-trend', () => {
        it('should return daily timeline data points', async () => {
            const { user: customer } = await createTestUser('user');
            const { token: adminToken } = await createTestUser('admin');
            const category = await createTestCategory('Cameras');
            const product = await createTestProduct(category._id.toString());

            await createTestOrder(customer._id.toString(), product._id.toString(), {
                totalPrice: 450,
                paymentStatus: 'paid',
            });

            const response = await request(app)
                .get('/api/admin/analytics/sales-trend?period=30d')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThanOrEqual(1);
            expect(response.body.data[0]).toHaveProperty('date');
            expect(response.body.data[0]).toHaveProperty('revenue');
            expect(response.body.data[0]).toHaveProperty('orders');
        });
    });

    describe('GET /api/admin/analytics/products', () => {
        it('should return top 5 best sellers and category sales distribution', async () => {
            const { user: customer } = await createTestUser('user');
            const { token: adminToken } = await createTestUser('admin');
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString(), { name: 'Eames Chair' });

            await createTestOrder(customer._id.toString(), product._id.toString(), {
                totalPrice: 800,
                paymentStatus: 'paid',
            });

            const response = await request(app)
                .get('/api/admin/analytics/products?period=all')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('topSellingProducts');
            expect(response.body.data).toHaveProperty('categorySalesDistribution');
            expect(response.body.data.topSellingProducts[0].name).toBe('Test Product');
        });
    });

    describe('GET /api/admin/analytics/inventory', () => {
        it('should return warehouse stock counts and valuation', async () => {
            const { token: adminToken } = await createTestUser('admin');
            const category = await createTestCategory('Living');

            await createTestProduct(category._id.toString(), { stock: 10, price: 100, discountPrice: 100 });
            await createTestProduct(category._id.toString(), { stock: 2, price: 200, discountPrice: 200 }); // Low stock

            const response = await request(app)
                .get('/api/admin/analytics/inventory')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.inStockCount).toBe(1);
            expect(response.body.data.lowStockCount).toBe(1);
            expect(response.body.data.totalCatalogItems).toBe(2);
            expect(response.body.data.totalWarehouseValuation).toBe(1400); // 10*100 + 2*200
        });
    });

    describe('GET /api/admin/analytics/geography', () => {
        it('should return sales grouped by country', async () => {
            const { user: customer } = await createTestUser('user');
            const { token: adminToken } = await createTestUser('admin');
            const category = await createTestCategory('Accessories');
            const product = await createTestProduct(category._id.toString());

            await createTestOrder(customer._id.toString(), product._id.toString(), {
                totalPrice: 500,
                paymentStatus: 'paid',
                shippingAddress: {
                    fullName: 'Test User',
                    phone: '1234567890',
                    addressLine: '123 Test St',
                    city: 'Berlin',
                    postalCode: '10115',
                    country: 'Germany',
                },
            });

            const response = await request(app)
                .get('/api/admin/analytics/geography?period=all')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data[0].country).toBe('Germany');
            expect(response.body.data[0].totalRevenue).toBe(500);
        });
    });

    describe('GET /api/admin/analytics/cart-abandonment', () => {
        it('should return cart abandonment metrics with populated product prices', async () => {
            const { user: customer } = await createTestUser('user');
            const { token: adminToken } = await createTestUser('admin');
            const category = await createTestCategory('Accessories');
            const product = await createTestProduct(category._id.toString(), { price: 200, discountPrice: 150 });

            // Seed an active cart with 2 units of the product ($150 * 2 = $300 potential revenue)
            await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${getToken(customer._id.toString())}`)
                .send({
                    productId: product._id.toString(),
                    quantity: 2,
                });

            const response = await request(app)
                .get('/api/admin/analytics/cart-abandonment')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.activeCartsCount).toBe(1);
            expect(response.body.data.potentialLostRevenue).toBe(300);
            expect(response.body.data).toHaveProperty('abandonmentRate');
        });
    });
});
