import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { ProductModel } from '../src/models/index.ts';
import {
    clearTestDatabase,
    createTestCategory,
    createTestOrder,
    createTestProduct,
    createTestUser,
} from './helpers/testSeeds.ts';

describe('Order API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    const shippingAddress = {
        fullName: 'Alexander Volyk',
        phone: '1234567890',
        city: 'San Francisco',
        postalCode: '94103',
        addressLine: '123 Market Street, Apt 4B',
        country: 'United States',
    };

    const validOrderPayload = (productId: string) => ({
        items: [
            {
                product: productId,
                quantity: 2,
            },
        ],
        shippingAddress,
        paymentMethod: 'Credit Card (Stripe)',
        shippingPrice: 15,
        taxPrice: 20,
    });

    describe('POST /api/orders', () => {
        it('should create an order, calculate prices, and decrement stock atomically', async () => {
            const { user, token } = await createTestUser('user');
            const category = await createTestCategory('Audio');
            const product = await createTestProduct(category._id.toString(), {
                price: 200,
                discountPrice: 150,
                stock: 10,
            });

            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(validOrderPayload(product._id.toString()));

            expect(response.status).toBe(201);
            expect(response.body.data).toMatchObject({
                user: user._id.toString(),
                itemsPrice: 300, // 150 * 2
                shippingPrice: 15,
                taxPrice: 20,
                totalPrice: 335,
                paymentStatus: 'pending',
                orderStatus: 'pending',
            });

            expect(response.body.data.orderNumber).toMatch(/^ORD-/);

            // Verify product stock decremented from 10 to 8
            const updatedProduct = await ProductModel.findById(product._id);
            expect(updatedProduct?.stock).toBe(8);
        });

        it('should reject when requested quantity exceeds available stock', async () => {
            const { token } = await createTestUser('user');
            const category = await createTestCategory('Cameras');
            const product = await createTestProduct(category._id.toString(), { stock: 1 });

            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(validOrderPayload(product._id.toString()));

            expect(response.status).toBe(422);
            expect(response.body.message).toContain('Not enough stock');
        });

        it('should reject unauthenticated request with 401', async () => {
            const category = await createTestCategory('Cameras');
            const product = await createTestProduct(category._id.toString());

            const response = await request(app)
                .post('/api/orders')
                .send(validOrderPayload(product._id.toString()));

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/orders/my', () => {
        it('should return only orders for the authenticated customer', async () => {
            const { user: user1, token: token1 } = await createTestUser('user', 'user1@test.com');
            const { user: user2 } = await createTestUser('user', 'user2@test.com');
            const category = await createTestCategory('Accessories');
            const product = await createTestProduct(category._id.toString());

            await createTestOrder(user1._id.toString(), product._id.toString());
            await createTestOrder(user2._id.toString(), product._id.toString());

            const response = await request(app)
                .get('/api/orders/my')
                .set('Authorization', `Bearer ${token1}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].user.toString()).toBe(user1._id.toString());
        });
    });

    describe('GET /api/orders/:id', () => {
        it('should allow customer to view their own order', async () => {
            const { user, token } = await createTestUser('user');
            const category = await createTestCategory('Accessories');
            const product = await createTestProduct(category._id.toString());
            const order = await createTestOrder(user._id.toString(), product._id.toString());

            const response = await request(app)
                .get(`/api/orders/${order._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(order._id.toString());
        });

        it('should allow admin to view any customer order', async () => {
            const { user: customer } = await createTestUser('user', 'customer@test.com');
            const { token: adminToken } = await createTestUser('admin', 'admin_view@test.com');
            const category = await createTestCategory('Accessories');
            const product = await createTestProduct(category._id.toString());
            const order = await createTestOrder(customer._id.toString(), product._id.toString());

            const response = await request(app)
                .get(`/api/orders/${order._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(order._id.toString());
        });

        it('should block another customer from viewing someone else order with 403', async () => {
            const { user: owner } = await createTestUser('user', 'owner@test.com');
            const { token: hackerToken } = await createTestUser('user', 'stranger@test.com');
            const category = await createTestCategory('Accessories');
            const product = await createTestProduct(category._id.toString());
            const order = await createTestOrder(owner._id.toString(), product._id.toString());

            const response = await request(app)
                .get(`/api/orders/${order._id}`)
                .set('Authorization', `Bearer ${hackerToken}`);

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /api/orders/:id/pay', () => {
        it('should mark an order as paid', async () => {
            const { user, token } = await createTestUser('user');
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString());
            const order = await createTestOrder(user._id.toString(), product._id.toString(), {
                paymentStatus: 'pending',
                paidAt: undefined,
            });

            const response = await request(app)
                .put(`/api/orders/${order._id}/pay`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.paymentStatus).toBe('paid');
            expect(response.body.data.paidAt).toBeDefined();
        });

        it('should return 400 when order is already paid', async () => {
            const { user, token } = await createTestUser('user');
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString());
            const order = await createTestOrder(user._id.toString(), product._id.toString(), {
                paymentStatus: 'paid',
                paidAt: new Date(),
            });

            const response = await request(app)
                .put(`/api/orders/${order._id}/pay`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Order is already paid');
        });
    });

    describe('PUT /api/orders/:id/status (Admin Only)', () => {
        it('should allow admin to update order status to shipped', async () => {
            const { user: customer } = await createTestUser('user', 'client@test.com');
            const { token: adminToken } = await createTestUser('admin', 'admin_ship@test.com');
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString());
            const order = await createTestOrder(customer._id.toString(), product._id.toString(), {
                orderStatus: 'processing',
            });

            const response = await request(app)
                .put(`/api/orders/${order._id}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    orderStatus: 'shipped',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.orderStatus).toBe('shipped');
        });

        it('should reject non-admin from updating order status with 403', async () => {
            const { user: customer, token: customerToken } = await createTestUser(
                'user',
                'client2@test.com',
            );
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString());
            const order = await createTestOrder(customer._id.toString(), product._id.toString());

            const response = await request(app)
                .put(`/api/orders/${order._id}/status`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    orderStatus: 'delivered',
                });

            expect(response.status).toBe(403);
        });
    });
});
