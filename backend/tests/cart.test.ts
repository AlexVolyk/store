import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { CartModel } from '../src/models/index.ts';
import {
    clearTestDatabase,
    createTestCategory,
    createTestProduct,
    createTestUser,
} from './helpers/testSeeds.ts';

describe('Cart API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe('GET /api/cart', () => {
        it('should return an empty cart for a new user', async () => {
            const { user, token } = await createTestUser('user');

            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toMatchObject({
                user: user._id.toString(),
                items: [],
            });
            expect(response.body.message).toBe('Cart fetched successfully');
        });

        it('should reject unauthenticated request with 401', async () => {
            const response = await request(app).get('/api/cart');
            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/cart/items', () => {
        it('should add a product to the cart', async () => {
            const { user, token } = await createTestUser('user');
            const category = await createTestCategory('Audio');
            const product = await createTestProduct(category._id.toString(), {
                name: 'Studio Headphones',
                stock: 10,
            });

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: product._id.toString(),
                    quantity: 2,
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Cart item added successfully');
            expect(response.body.data.items).toHaveLength(1);
            expect(response.body.data.items[0]).toMatchObject({
                quantity: 2,
            });

            const cart = await CartModel.findOne({ user: user._id });
            expect(cart?.items).toHaveLength(1);
            expect(cart?.items[0].quantity).toBe(2);
        });

        it('should increment quantity when product already in cart', async () => {
            const { token } = await createTestUser('user');
            const category = await createTestCategory('Accessories');
            const product = await createTestProduct(category._id.toString(), { stock: 20 });

            // Add 2 units
            await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id.toString(), quantity: 2 });

            // Add 3 more units
            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id.toString(), quantity: 3 });

            expect(response.status).toBe(200);
            expect(response.body.data.items[0].quantity).toBe(5);
        });

        it('should return 422 when requested quantity exceeds available stock', async () => {
            const { token } = await createTestUser('user');
            const category = await createTestCategory('Cameras');
            const product = await createTestProduct(category._id.toString(), { stock: 2 });

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id.toString(), quantity: 5 });

            expect(response.status).toBe(422);
            expect(response.body.message).toBe('Not enough product stock');
        });
    });

    describe('PATCH /api/cart/items/:productId', () => {
        it('should update a cart item quantity', async () => {
            const { token } = await createTestUser('user');
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString(), { stock: 15 });

            await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id.toString(), quantity: 2 });

            const response = await request(app)
                .patch(`/api/cart/items/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ quantity: 4 });

            expect(response.status).toBe(200);
            expect(response.body.data.items[0].quantity).toBe(4);
        });
    });

    describe('DELETE /api/cart/items/:productId', () => {
        it('should remove a product from the cart', async () => {
            const { token } = await createTestUser('user');
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString(), { stock: 10 });

            await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id.toString(), quantity: 2 });

            const response = await request(app)
                .delete(`/api/cart/items/${product._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.items).toHaveLength(0);
        });
    });

    describe('DELETE /api/cart', () => {
        it('should clear all items from the cart', async () => {
            const { token } = await createTestUser('user');
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString(), { stock: 10 });

            await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: product._id.toString(), quantity: 2 });

            const response = await request(app)
                .delete('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.items).toHaveLength(0);
            expect(response.body.message).toBe('Cart cleared successfully');
        });
    });
});
