import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app.ts';
import {
    CategoryModel,
    ProductModel,
    UserModel,
    WishlistModel,
} from '../src/models/index.ts';
import { getToken } from '../src/utils/index.ts';

describe('Wishlist API', () => {
    beforeEach(async () => {
        await WishlistModel.deleteMany({});
        await ProductModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await UserModel.deleteMany({});
    });


    const createUser = async () => {
        return UserModel.create({
            firstName: 'John',
            lastName: 'Doe',
            email: `john-${Date.now()}@test.com`,
            password: 'Password123!',
        });
    };
    
    const createCategory = async () => {
        return CategoryModel.create({
            name: `Electronics-${Date.now()}`,
            description: 'Electronic products',
        });
    };


    const createProduct = async (
        categoryId: string,
        overrides = {},
    ) => {
        return ProductModel.create({
            name: 'Test Product',
            description: 'Test product description',
            price: 100,
            stock: 10,
            images: [],
            brand: 'Test Brand',
            category: categoryId,
            ...overrides,
        });
    };

    const getAuthToken = async () => {
        const user = await createUser();

        return {
            user,
            token: getToken(user.id),
        };
    };

    describe('GET /api/wishlist', () => {
        it('should return an empty wishlist for a user without a wishlist', async () => {
            const { user, token } = await getAuthToken();

            const response = await request(app)
                .get('/api/wishlist')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body.data).toMatchObject({
                user: user.id,
                products: [],
            });

            expect(response.body.message)
                .toBe('Wishlist fetched successfully');
        });

        it('should return the user wishlist', async () => {
            const { user, token } = await getAuthToken();

            const category = await createCategory()
            const product = await createProduct(category.id);

            await WishlistModel.create({
                user: user.id,
                products: [product.id],
            });

            const response = await request(app)
                .get('/api/wishlist')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body.data.products).toHaveLength(1);

            expect(response.body.data.products[0]).toMatchObject({
                name: 'Test Product',
                price: 100,
            });
        });

        it('should reject a request without a token', async () => {
            const response = await request(app)
                .get('/api/wishlist');

            expect(response.status).toBe(401);
        });

        it('should reject an invalid token', async () => {
            const response = await request(app)
                .get('/api/wishlist')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/wishlist/:productId', () => {
        it('should add a product to the wishlist', async () => {
            const { user, token } = await getAuthToken();

            const category = await createCategory()
            const product = await createProduct(category.id);

            const response = await request(app)
                .post(`/api/wishlist/${product.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body.message)
                .toBe('Product added to wishlist successfully');

            expect(response.body.data.products).toHaveLength(1);

            const wishlist = await WishlistModel.findOne({
                user: user.id,
            });

            expect(wishlist).not.toBeNull();
            expect(wishlist?.products).toHaveLength(1);
            expect(wishlist?.products[0].toString())
                .toBe(product.id);
        });

        it('should return 404 when the product does not exist', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .post('/api/wishlist/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);

            expect(response.body.message)
                .toBe('Product not found');
        });

        it('should return 409 when the product is already in wishlist', async () => {
            const { user, token } = await getAuthToken();

            const category = await createCategory()
            const product = await createProduct(category.id);

            await WishlistModel.create({
                user: user.id,
                products: [product.id],
            });

            const response = await request(app)
                .post(`/api/wishlist/${product.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(409);

            expect(response.body.message)
                .toBe('Product is already in wishlist');
        });

        it('should reject an invalid product id', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .post('/api/wishlist/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
        });

        it('should reject a request without a token', async () => {
            const category = await createCategory()
            const product = await createProduct(category.id);

            const response = await request(app)
                .post(`/api/wishlist/${product.id}`);

            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /api/wishlist/:productId', () => {
        it('should remove a product from the wishlist', async () => {
            const { user, token } = await getAuthToken();

            const category = await createCategory()
            const product = await createProduct(category.id);

            await WishlistModel.create({
                user: user.id,
                products: [product.id],
            });

            const response = await request(app)
                .delete(`/api/wishlist/${product.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body.message)
                .toBe('Product removed from wishlist successfully');

            expect(response.body.data.products)
                .toHaveLength(0);

            const wishlist = await WishlistModel.findOne({
                user: user.id,
            });

            expect(wishlist?.products).toHaveLength(0);
        });

        it('should return 404 when the wishlist does not exist', async () => {
            const { token } = await getAuthToken();

            const category = await createCategory()
            const product = await createProduct(category.id)

            const response = await request(app)
                .delete(`/api/wishlist/${product.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);

            expect(response.body.message)
                .toBe('Wishlist not found');
        });

        it('should reject an invalid product id', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .delete('/api/wishlist/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
        });

        it('should reject a request without a token', async () => {
            const category = await createCategory()
            const product = await createProduct(category.id);

            const response = await request(app)
                .delete(`/api/wishlist/${product.id}`);

            expect(response.status).toBe(401);
        });
    });
});