import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app.ts';
import {
    CategoryModel,
    OrderModel,
    ProductModel,
    UserModel,
} from '../src/models/index.ts';
import { getToken } from '../src/utils/index.ts';

describe('Order API', () => {
    beforeEach(async () => {
        await OrderModel.deleteMany({});
        await ProductModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await UserModel.deleteMany({});
    });

    const createUser = async (overrides = {}) => {
        return UserModel.create({
            firstName: 'John',
            lastName: 'Doe',
            email: `john-${Date.now()}@test.com`,
            password: 'Password123!',
            ...overrides,
        });
    };

    const createAdmin = async () => {
        return createUser({
            email: `admin-${Date.now()}@test.com`,
            role: 'admin',
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
            images: ['image.jpg'],
            brand: 'Test Brand',
            category: categoryId,
            ...overrides,
        });
    };

    const shippingAddress = {
        fullName: 'John Doe',
        phone: '380991234567',
        city: 'Kyiv',
        postalCode: '01001',
        addressLine: '123 Main Street',
        country: 'Ukraine',
    };

    const validOrderPayload = (productId: string) => ({
        items: [
            {
                product: productId,
                quantity: 2,
            },
        ],
        shippingAddress,
        paymentMethod: 'card',
        shippingPrice: 10,
        taxPrice: 5,
    });

    const createOrderInDb = async (
        userId: string,
        productId: string,
        overrides = {},
    ) => {
        return OrderModel.create({
            user: userId,
            items: [
                {
                    product: productId,
                    name: 'Test Product',
                    image: 'image.jpg',
                    price: 100,
                    quantity: 2,
                },
            ],
            shippingAddress,
            paymentMethod: 'card',
            itemsPrice: 200,
            shippingPrice: 10,
            taxPrice: 5,
            totalPrice: 215,
            ...overrides,
        });
    };

    const getAuthToken = async (
        user?: Awaited<ReturnType<typeof createUser>>,
    ) => {
        const authUser = user ?? await createUser();

        return {
            user: authUser,
            token: getToken(authUser.id),
        };
    };

    describe('POST /api/orders', () => {
        it('should create an order with calculated prices', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id, {
                price: 100,
                discountPrice: 80,
            });

            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(validOrderPayload(product.id));

            expect(response.status).toBe(201);

            expect(response.body.data).toMatchObject({
                user: user.id,
                itemsPrice: 160,
                shippingPrice: 10,
                taxPrice: 5,
                totalPrice: 175,
                paymentMethod: 'card',
                paymentStatus: 'pending',
                orderStatus: 'pending',
            });

            expect(response.body.data.items).toHaveLength(1);

            expect(response.body.data.items[0]).toMatchObject({
                name: 'Test Product',
                price: 80,
                quantity: 2,
            });

            expect(response.body.message)
                .toBe('Order created successfully');

            const order = await OrderModel.findOne({
                user: user.id,
            });

            expect(order).not.toBeNull();
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
                .post('/api/orders')
                .send(validOrderPayload(product.id));

            expect(response.status).toBe(401);
        });

        it('should return 400 when a product does not exist', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...validOrderPayload('507f1f77bcf86cd799439011'),
                });

            expect(response.status).toBe(400);

            expect(response.body.message)
                .toContain('Product not found');
        });

        it('should return 422 when a product is not active', async () => {
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id, {
                isActive: false,
            });

            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(validOrderPayload(product.id));

            expect(response.status).toBe(422);

            expect(response.body.message)
                .toContain('Product is not available');
        });

        it('should return 422 when there is not enough stock', async () => {
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id, {
                stock: 1,
            });

            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(validOrderPayload(product.id));

            expect(response.status).toBe(422);

            expect(response.body.message)
                .toContain('Not enough stock');
        });

        it('should reject invalid order data', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [],
                    shippingAddress: {},
                    paymentMethod: '',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/orders/my', () => {
        it('should return an empty array when the user has no orders', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .get('/api/orders/my')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body.data).toEqual([]);

            expect(response.body.message)
                .toBe('Orders fetched successfully');
        });

        it('should return only the authenticated user orders', async () => {
            const { user, token } = await getAuthToken();
            const otherUser = await createUser();
            const category = await createCategory();
            const product = await createProduct(category.id);

            await createOrderInDb(user.id, product.id);
            await createOrderInDb(otherUser.id, product.id);

            const response = await request(app)
                .get('/api/orders/my')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body.data).toHaveLength(1);

            expect(response.body.data[0].user.toString())
                .toBe(user.id);
        });

        it('should reject unauthenticated requests', async () => {
            const response = await request(app)
                .get('/api/orders/my');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/orders/:id', () => {
        it('should return an order for the order owner', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(user.id, product.id);

            const response = await request(app)
                .get(`/api/orders/${order.id}`)
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toBe(200);

            expect(response.body.data).toMatchObject({
                itemsPrice: 200,
                totalPrice: 215,
            });

            expect(response.body.message)
                .toBe('Order fetched successfully');
        });

        it('should allow an admin to view any order', async () => {
            const owner = await createUser();
            const admin = await createAdmin();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(owner.id, product.id);
            const token = getToken(admin.id);

            const response = await request(app)
                .get(`/api/orders/${order.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it('should reject access from a non-owner user', async () => {
            const owner = await createUser();
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(owner.id, product.id);

            const response = await request(app)
                .get(`/api/orders/${order.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
        });

        it('should return 404 for a non-existing order', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .get('/api/orders/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);

            expect(response.body.message)
                .toBe('Order not found');
        });

        it('should reject an invalid order id', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .get('/api/orders/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/orders/:id/pay', () => {
        it('should mark an order as paid for the order owner', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(user.id, product.id);

            const response = await request(app)
                .put(`/api/orders/${order.id}/pay`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body.data).toMatchObject({
                paymentStatus: 'paid',
            });

            expect(response.body.data.paidAt).toBeDefined();

            expect(response.body.message)
                .toBe('Order marked as paid');
        });

        it('should return 400 when the order is already paid', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(user.id, product.id, {
                paymentStatus: 'paid',
                paidAt: new Date(),
            });

            const response = await request(app)
                .put(`/api/orders/${order.id}/pay`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);

            expect(response.body.message)
                .toBe('Order is already paid');
        });

        it('should reject access from a non-owner user', async () => {
            const owner = await createUser();
            const { token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(owner.id, product.id);

            const response = await request(app)
                .put(`/api/orders/${order.id}/pay`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
        });

        it('should return 404 for a non-existing order', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .put('/api/orders/507f1f77bcf86cd799439011/pay')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/orders/:id/deliver', () => {
        it('should allow an admin to mark an order as delivered', async () => {
            const owner = await createUser();
            const admin = await createAdmin();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(owner.id, product.id);
            const token = getToken(admin.id);

            const response = await request(app)
                .put(`/api/orders/${order.id}/deliver`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body.data).toMatchObject({
                orderStatus: 'delivered',
            });

            expect(response.body.data.deliveredAt).toBeDefined();

            expect(response.body.message)
                .toBe('Order marked as delivered');
        });

        it('should reject non-admin users', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(user.id, product.id);

            const response = await request(app)
                .put(`/api/orders/${order.id}/deliver`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
        });

        it('should return 404 for a non-existing order', async () => {
            const admin = await createAdmin();
            const token = getToken(admin.id);

            const response = await request(app)
                .put('/api/orders/507f1f77bcf86cd799439011/deliver')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/orders/:id/status', () => {
        it('should allow an admin to update order status', async () => {
            const owner = await createUser();
            const admin = await createAdmin();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(owner.id, product.id);
            const token = getToken(admin.id);

            const response = await request(app)
                .put(`/api/orders/${order.id}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    orderStatus: 'shipped',
                });

            expect(response.status).toBe(200);

            expect(response.body.data.orderStatus)
                .toBe('shipped');

            expect(response.body.message)
                .toBe('Order status updated successfully');
        });

        it('should reject non-admin users', async () => {
            const { user, token } = await getAuthToken();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(user.id, product.id);

            const response = await request(app)
                .put(`/api/orders/${order.id}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    orderStatus: 'processing',
                });

            expect(response.status).toBe(403);
        });

        it('should return 404 for a non-existing order', async () => {
            const admin = await createAdmin();
            const token = getToken(admin.id);

            const response = await request(app)
                .put('/api/orders/507f1f77bcf86cd799439011/status')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    orderStatus: 'processing',
                });

            expect(response.status).toBe(404);
        });

        it('should reject an invalid order status', async () => {
            const admin = await createAdmin();
            const category = await createCategory();
            const product = await createProduct(category.id);
            const order = await createOrderInDb(admin.id, product.id);
            const token = getToken(admin.id);

            const response = await request(app)
                .put(`/api/orders/${order.id}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    orderStatus: 'invalid-status',
                });

            expect(response.status).toBe(400);
        });
    });
});
