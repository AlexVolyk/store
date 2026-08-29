import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app.ts';
import { CartModel, CategoryModel, ProductModel, UserModel } from '../src/models/index.ts';
import { getToken } from '../src/utils/index.ts';

describe('Cart API', () => {
    beforeEach(async () => {
        await CartModel.deleteMany({});
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

    const createProduct = async (categoryId: string, overrides = {}) => {
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

    const createCart = async (
        userId: string,
        items: { product: string; quantity: number }[] = [],
    ) => {
        return CartModel.create({
            user: userId,
            items,
        });
    };

    const getAuthToken = async () => {
        const user = await createUser();

        return {
            user,
            token: getToken(user.id),
        };
    };

    describe('GET /api/cart', () => {
        it('should return an empty cart for a user without a cart', async () => {
            const { user, token } = await getAuthToken();

            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toMatchObject({
                user: user.id,
                items: [],
            });

            expect(response.body.message)
.toBe('Cart fetched successfully');
        });

        it('should return the user cart with populated products', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);

            await createCart(user.id, [{ product: product.id, quantity: 2 }]);

            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(200);

            expect(response.body.data.items)
.toHaveLength(1);

            expect(response.body.data.items[0])
.toMatchObject({
                quantity: 2,
            });

            expect(response.body.data.items[0].product)
.toMatchObject({
                name: 'Test Product',
                price: 100,
            });
        });

        it('should reject a request without a token', async () => {
            const response = await request(app)
.get('/api/cart');

            expect(response.status)
.toBe(401);
        });

        it('should reject an invalid token', async () => {
            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status)
.toBe(401);
        });
    });

    describe('POST /api/cart/items', () => {
        it('should add a product to the cart', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: product.id,
                    quantity: 2,
                });

            expect(response.status)
.toBe(200);

            expect(response.body.message)
.toBe('Cart item added successfully');

            expect(response.body.data.items)
.toHaveLength(1);

            expect(response.body.data.items[0])
.toMatchObject({
                quantity: 2,
            });

            const cart = await CartModel.findOne({
                user: user.id,
            });

            expect(cart).not.toBeNull();
            expect(cart?.items)
.toHaveLength(1);
            expect(cart?.items[0].quantity)
.toBe(2);
        });

        it('should default quantity to 1 when not provided', async () => {
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: product.id,
                });

            expect(response.status)
.toBe(200);

            expect(response.body.data.items[0].quantity)
.toBe(1);
        });

        it('should increment quantity when the product is already in the cart', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);

            await createCart(user.id, [{ product: product.id, quantity: 2 }]);

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: product.id,
                    quantity: 3,
                });

            expect(response.status)
.toBe(200);

            expect(response.body.data.items)
.toHaveLength(1);

            expect(response.body.data.items[0].quantity)
.toBe(5);
        });

        it('should return 404 when the product does not exist', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: '507f1f77bcf86cd799439011',
                    quantity: 1,
                });

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Product not found');
        });

        it('should return 422 when the product is not active', async () => {
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id, {
                isActive: false,
            });

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: product.id,
                    quantity: 1,
                });

            expect(response.status)
.toBe(422);

            expect(response.body.message)
.toBe('Product is not available');
        });

        it('should return 422 when there is not enough stock', async () => {
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id, {
                stock: 2,
            });

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: product.id,
                    quantity: 5,
                });

            expect(response.status)
.toBe(422);

            expect(response.body.message)
.toBe('Not enough product stock');
        });

        it('should return 422 when incrementing exceeds available stock', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id, {
                stock: 5,
            });

            await createCart(user.id, [{ product: product.id, quantity: 3 }]);

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: product.id,
                    quantity: 3,
                });

            expect(response.status)
.toBe(422);

            expect(response.body.message)
.toBe('Not enough product stock');
        });

        it('should reject invalid product data', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    productId: 'invalid-id',
                    quantity: 0,
                });

            expect(response.status)
.toBe(400);
        });

        it('should reject a request without a token', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
.post('/api/cart/items')
.send({
                productId: product.id,
                quantity: 1,
            });

            expect(response.status)
.toBe(401);
        });
    });

    describe('PATCH /api/cart/items/:productId', () => {
        it('should update a cart item quantity', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);

            await createCart(user.id, [{ product: product.id, quantity: 2 }]);

            const response = await request(app)
                .patch(`/api/cart/items/${product.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 4,
                });

            expect(response.status)
.toBe(200);

            expect(response.body.message)
.toBe('Cart item updated successfully');

            expect(response.body.data.items[0].quantity)
.toBe(4);
        });

        it('should return 404 when the cart does not exist', async () => {
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
                .patch(`/api/cart/items/${product.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 2,
                });

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Cart not found');
        });

        it('should return 404 when the cart item does not exist', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const otherProduct = await createProduct(category.id, {
                name: 'Other Product',
            });

            await createCart(user.id, [{ product: product.id, quantity: 1 }]);

            const response = await request(app)
                .patch(`/api/cart/items/${otherProduct.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 2,
                });

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Cart item not found');
        });

        it('should return 422 when there is not enough stock', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id, {
                stock: 3,
            });

            await createCart(user.id, [{ product: product.id, quantity: 1 }]);

            const response = await request(app)
                .patch(`/api/cart/items/${product.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 10,
                });

            expect(response.status)
.toBe(422);

            expect(response.body.message)
.toBe('Not enough product stock');
        });

        it('should reject an invalid product id', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .patch('/api/cart/items/invalid-id')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: 2,
                });

            expect(response.status)
.toBe(400);
        });

        it('should reject a request without a token', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
.patch(`/api/cart/items/${product.id}`)
.send({
                quantity: 2,
            });

            expect(response.status)
.toBe(401);
        });
    });

    describe('DELETE /api/cart/items/:productId', () => {
        it('should remove a product from the cart', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);

            await createCart(user.id, [{ product: product.id, quantity: 2 }]);

            const response = await request(app)
                .delete(`/api/cart/items/${product.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(200);

            expect(response.body.message)
.toBe('Cart item deleted successfully');

            expect(response.body.data.items)
.toHaveLength(0);

            const cart = await CartModel.findOne({
                user: user.id,
            });

            expect(cart?.items)
.toHaveLength(0);
        });

        it('should return 404 when the cart does not exist', async () => {
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
                .delete(`/api/cart/items/${product.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Cart not found');
        });

        it('should return 404 when the cart item does not exist', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const otherProduct = await createProduct(category.id, {
                name: 'Other Product',
            });

            await createCart(user.id, [{ product: product.id, quantity: 1 }]);

            const response = await request(app)
                .delete(`/api/cart/items/${otherProduct.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Cart item not found');
        });

        it('should reject an invalid product id', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .delete('/api/cart/items/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(400);
        });

        it('should reject a request without a token', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
.delete(`/api/cart/items/${product.id}`);

            expect(response.status)
.toBe(401);
        });
    });

    describe('DELETE /api/cart', () => {
        it('should clear all items from the cart', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const otherProduct = await createProduct(category.id, {
                name: 'Other Product',
            });

            await createCart(user.id, [
                { product: product.id, quantity: 2 },
                { product: otherProduct.id, quantity: 1 },
            ]);

            const response = await request(app)
                .delete('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(200);

            expect(response.body.message)
.toBe('Cart cleared successfully');

            expect(response.body.data.items)
.toHaveLength(0);

            const cart = await CartModel.findOne({
                user: user.id,
            });

            expect(cart?.items)
.toHaveLength(0);
        });

        it('should reject a request without a token', async () => {
            const response = await request(app)
.delete('/api/cart');

            expect(response.status)
.toBe(401);
        });
    });
});
