import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { WishlistModel } from '../src/models/index.ts';
import {
    clearTestDatabase,
    createTestCategory,
    createTestProduct,
    createTestUser,
} from './helpers/testSeeds.ts';

describe('Wishlist API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe('GET /api/wishlist', () => {
        it('should return an empty wishlist for a new user', async () => {
            const { user, token } = await createTestUser('user');

            const response = await request(app)
                .get('/api/wishlist')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toMatchObject({
                user: user._id.toString(),
                products: [],
            });
            expect(response.body.message).toBe('Wishlist fetched successfully');
        });

        it('should reject unauthenticated requests with 401', async () => {
            const response = await request(app).get('/api/wishlist');
            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/wishlist/:productId', () => {
        it('should add a product to the wishlist', async () => {
            const { user, token } = await createTestUser('user');
            const category = await createTestCategory('Accessories');
            const product = await createTestProduct(category._id.toString());

            const response = await request(app)
                .post(`/api/wishlist/${product._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Product added to wishlist successfully');
            expect(response.body.data.products).toHaveLength(1);

            const wishlist = await WishlistModel.findOne({ user: user._id });
            expect(wishlist?.products).toHaveLength(1);
            expect(wishlist?.products[0].toString()).toBe(product._id.toString());
        });

        it('should return 409 when product is already in wishlist', async () => {
            const { token } = await createTestUser('user');
            const category = await createTestCategory('Audio');
            const product = await createTestProduct(category._id.toString());

            // Add first time
            await request(app)
                .post(`/api/wishlist/${product._id}`)
                .set('Authorization', `Bearer ${token}`);

            // Add duplicate
            const response = await request(app)
                .post(`/api/wishlist/${product._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(409);
            expect(response.body.message).toBe('Product is already in wishlist');
        });
    });

    describe('DELETE /api/wishlist/:productId', () => {
        it('should remove a product from the wishlist', async () => {
            const { token } = await createTestUser('user');
            const category = await createTestCategory('Cameras');
            const product = await createTestProduct(category._id.toString());

            await request(app)
                .post(`/api/wishlist/${product._id}`)
                .set('Authorization', `Bearer ${token}`);

            const response = await request(app)
                .delete(`/api/wishlist/${product._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.products).toHaveLength(0);
            expect(response.body.message).toBe('Product removed from wishlist successfully');
        });
    });
});
