import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { ProductModel } from '../src/models/index.ts';
import {
    clearTestDatabase,
    createTestCategory,
    createTestProduct,
    createTestUser,
} from './helpers/testSeeds.ts';

describe('Product API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    const validProductPayload = (categoryId: string) => ({
        name: `Analog Timepiece ${Date.now()}`,
        description: 'Refined brushed titanium casing with sapphire glass.',
        price: 350,
        discountPrice: 290,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1?w=900'],
        brand: 'Forma Studio',
        category: categoryId,
        badge: 'New Arrival',
    });

    describe('GET /api/products', () => {
        it('should return all active products with pagination', async () => {
            const category = await createTestCategory('Living');

            await createTestProduct(category._id.toString(), {
                name: 'Laptop Desk',
                price: 999,
            });

            await createTestProduct(category._id.toString(), {
                name: 'Desk Lamp',
                price: 199,
            });

            const response = await request(app).get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination).toMatchObject({
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1,
            });
        });

        it('should return empty array when catalog is empty', async () => {
            const response = await request(app).get('/api/products');
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });

        it('should filter products by price range', async () => {
            const category = await createTestCategory('Accessories');

            await createTestProduct(category._id.toString(), { name: 'Cheap Item', price: 50 });
            await createTestProduct(category._id.toString(), { name: 'Mid Item', price: 150 });
            await createTestProduct(category._id.toString(), { name: 'Expensive Item', price: 500 });

            const response = await request(app)
                .get('/api/products')
                .query({ minPrice: 100, maxPrice: 200 });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].name).toBe('Mid Item');
        });

        it('should sort products by price ascending', async () => {
            const category = await createTestCategory('Accessories');

            await createTestProduct(category._id.toString(), { name: 'Expensive Watch', price: 900 });
            await createTestProduct(category._id.toString(), { name: 'Affordable Strap', price: 50 });

            const response = await request(app)
                .get('/api/products')
                .query({ sort: 'price_asc' });

            expect(response.status).toBe(200);
            expect(response.body.data[0].name).toBe('Affordable Strap');
            expect(response.body.data[1].name).toBe('Expensive Watch');
        });

        it('should filter products by badge', async () => {
            const category = await createTestCategory('Living');

            await createTestProduct(category._id.toString(), { name: 'Sale Chair', badge: 'Sale' });
            await createTestProduct(category._id.toString(), { name: 'New Lamp', badge: 'New Arrival' });

            const response = await request(app)
                .get('/api/products')
                .query({ badge: 'Sale' });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].badge).toBe('Sale');
        });

        it('should filter products by brand', async () => {
            const category = await createTestCategory('Cameras');

            await createTestProduct(category._id.toString(), { name: 'Leica M11', brand: 'Leica' });
            await createTestProduct(category._id.toString(), { name: 'Sony A7', brand: 'Sony' });

            const response = await request(app)
                .get('/api/products')
                .query({ brand: 'Leica' });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].brand).toBe('Leica');
        });

        it('should exclude inactive products from public listing', async () => {
            const category = await createTestCategory('Cameras');

            await createTestProduct(category._id.toString(), { name: 'Active Cam', isActive: true });
            await createTestProduct(category._id.toString(), { name: 'Archived Cam', isActive: false });

            const response = await request(app).get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].name).toBe('Active Cam');
        });
    });

    describe('GET /api/products/:idOrSlug', () => {
        it('should fetch product by ObjectId', async () => {
            const category = await createTestCategory('Audio');
            const product = await createTestProduct(category._id.toString(), {
                name: 'Precision Turntable',
            });

            const response = await request(app).get(`/api/products/${product._id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Precision Turntable');
            expect(response.body.data.category).toHaveProperty('name', 'Audio');
        });

        it('should fetch product by unique slug', async () => {
            const category = await createTestCategory('Audio');
            const product = await createTestProduct(category._id.toString(), {
                name: 'HiFi Amplifier',
                slug: 'hifi-amplifier-pro',
            });

            const response = await request(app).get(`/api/products/${product.slug}`);

            expect(response.status).toBe(200);
            expect(response.body.data.slug).toBe('hifi-amplifier-pro');
        });

        it('should return 404 for a non-existing product slug/id', async () => {
            const response = await request(app).get('/api/products/non-existing-product-slug');
            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/products (Admin Only)', () => {
        it('should allow admin to create a new product', async () => {
            const category = await createTestCategory('Wearables');
            const { token: adminToken } = await createTestUser('admin');

            const payload = validProductPayload(category._id.toString());

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.data).toMatchObject({
                price: 350,
                discountPrice: 290,
                badge: 'New Arrival',
            });

            const dbProduct = await ProductModel.findById(response.body.data._id);
            expect(dbProduct).not.toBeNull();
        });

        it('should reject non-admin users with 403 Forbidden', async () => {
            const category = await createTestCategory('Wearables');
            const { token: userToken } = await createTestUser('user');

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send(validProductPayload(category._id.toString()));

            expect(response.status).toBe(403);
        });

        it('should reject discount price greater than regular price', async () => {
            const category = await createTestCategory('Wearables');
            const { token: adminToken } = await createTestUser('admin');

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    ...validProductPayload(category._id.toString()),
                    price: 100,
                    discountPrice: 200,
                });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/products/:id (Admin Only)', () => {
        it('should update a product by id', async () => {
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString());
            const { token: adminToken } = await createTestUser('admin');

            const response = await request(app)
                .put(`/api/products/${product._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Chair Name',
                    price: 499,
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Chair Name');
            expect(response.body.data.price).toBe(499);
        });
    });

    describe('DELETE /api/products/:id (Admin Only)', () => {
        it('should delete a product by id', async () => {
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString());
            const { token: adminToken } = await createTestUser('admin');

            const response = await request(app)
                .delete(`/api/products/${product._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Product deleted successfully');

            const dbProduct = await ProductModel.findById(product._id);
            expect(dbProduct).toBeNull();
        });
    });
});
