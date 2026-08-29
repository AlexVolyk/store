import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app.ts';
import { CategoryModel, ProductModel, UserModel } from '../src/models/index.ts';
import { getToken } from '../src/utils/index.ts';

describe('Product API', () => {
    beforeEach(async () => {
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

    const createCategory = async (overrides = {}) => {
        return CategoryModel.create({
            name: `Electronics-${Date.now()}`,
            description: 'Electronic products',
            ...overrides,
        });
    };

    const createProduct = async (categoryId: string, overrides = {}) => {
        return ProductModel.create({
            name: `Test Product-${Date.now()}`,
            description: 'Test product description',
            price: 100,
            stock: 10,
            images: ['image.jpg'],
            brand: 'Test Brand',
            category: categoryId,
            ...overrides,
        });
    };

    const getAuthToken = async () => {
        const user = await createUser();

        return getToken(user.id);
    };

    const validProductPayload = (categoryId: string) => ({
        name: 'New Product',
        description: 'A brand new product',
        price: 99.99,
        stock: 25,
        images: ['photo.jpg'],
        brand: 'BrandX',
        category: categoryId,
    });

    describe('GET /api/products', () => {
        it('should return all active products with pagination', async () => {
            const category = await createCategory();

            await createProduct(category.id, {
                name: 'Laptop',
                price: 999,
            });

            await createProduct(category.id, {
                name: 'Phone',
                price: 499,
            });

            const response = await request(app)
.get('/api/products');

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toHaveLength(2);

            expect(response.body.pagination)
.toMatchObject({
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1,
            });

            expect(response.body.message)
.toBe('Products fetched successfully');
        });

        it('should return an empty array when there are no products', async () => {
            const response = await request(app)
.get('/api/products');

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toEqual([]);

            expect(response.body.message)
.toBe('No products yet');
        });

        it('should exclude inactive products', async () => {
            const category = await createCategory();

            await createProduct(category.id, {
                name: 'Active Product',
                isActive: true,
            });

            await createProduct(category.id, {
                name: 'Inactive Product',
                isActive: false,
            });

            const response = await request(app)
.get('/api/products');

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toHaveLength(1);

            expect(response.body.data[0].name)
.toBe('Active Product');
        });

        it('should filter products by category', async () => {
            const electronics = await createCategory({
                name: 'Electronics',
            });

            const clothing = await createCategory({
                name: 'Clothing',
            });

            await createProduct(electronics.id, {
                name: 'Laptop',
            });

            await createProduct(clothing.id, {
                name: 'T-Shirt',
            });

            const response = await request(app)
                .get('/api/products')
                .query({ category: electronics.id });

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toHaveLength(1);

            expect(response.body.data[0].name)
.toBe('Laptop');
        });

        it('should search products by name', async () => {
            const category = await createCategory();

            await createProduct(category.id, {
                name: 'Gaming Laptop',
            });

            await createProduct(category.id, {
                name: 'Office Chair',
            });

            const response = await request(app)
.get('/api/products')
.query({ search: 'laptop' });

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toHaveLength(1);

            expect(response.body.data[0].name)
.toBe('Gaming Laptop');
        });

        it('should filter products by price range', async () => {
            const category = await createCategory();

            await createProduct(category.id, {
                name: 'Cheap Item',
                price: 50,
            });

            await createProduct(category.id, {
                name: 'Mid Item',
                price: 150,
            });

            await createProduct(category.id, {
                name: 'Expensive Item',
                price: 500,
            });

            const response = await request(app)
                .get('/api/products')
                .query({ minPrice: 100, maxPrice: 200 });

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toHaveLength(1);

            expect(response.body.data[0].name)
.toBe('Mid Item');
        });

        it('should sort products by price ascending', async () => {
            const category = await createCategory();

            await createProduct(category.id, {
                name: 'Expensive',
                price: 300,
            });

            await createProduct(category.id, {
                name: 'Cheap',
                price: 50,
            });

            const response = await request(app)
.get('/api/products')
.query({ sort: 'price_asc' });

            expect(response.status)
.toBe(200);

            expect(response.body.data[0].name)
.toBe('Cheap');

            expect(response.body.data[1].name)
.toBe('Expensive');
        });

        it('should paginate products', async () => {
            const category = await createCategory();

            for (let i = 1; i <= 3; i++) {
                await createProduct(category.id, {
                    name: `Product ${i}`,
                });
            }

            const response = await request(app)
.get('/api/products')
.query({ page: 2, limit: 1 });

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toHaveLength(1);

            expect(response.body.pagination)
.toMatchObject({
                page: 2,
                limit: 1,
                total: 3,
                totalPages: 3,
            });
        });
    });

    describe('GET /api/products/:id', () => {
        it('should return a product by id with populated category', async () => {
            const category = await createCategory({
                name: 'Electronics',
            });

            const product = await createProduct(category.id, {
                name: 'Laptop',
                price: 999,
            });

            const response = await request(app)
.get(`/api/products/${product.id}`);

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toMatchObject({
                name: 'Laptop',
                price: 999,
            });

            expect(response.body.data.category)
.toMatchObject({
                name: 'Electronics',
                description: 'Electronic products',
            });

            expect(response.body.message)
.toBe('Product fetched successfully');
        });

        it('should return 404 for a non-existing product', async () => {
            const response = await request(app)
.get('/api/products/507f1f77bcf86cd799439011');

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Product not found');
        });

        it('should reject an invalid product id', async () => {
            const response = await request(app)
.get('/api/products/invalid-id');

            expect(response.status)
.toBe(400);
        });
    });

    describe('POST /api/products', () => {
        it('should create a product', async () => {
            const category = await createCategory();
            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send(validProductPayload(category.id));

            expect(response.status)
.toBe(201);

            expect(response.body.data)
.toMatchObject({
                name: 'New Product',
                description: 'A brand new product',
                price: 99.99,
                stock: 25,
                brand: 'BrandX',
            });

            expect(response.body.message)
.toBe('Product created successfully');

            const product = await ProductModel.findOne({
                name: 'New Product',
            });

            expect(product).not.toBeNull();
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();

            const response = await request(app)
                .post('/api/products')
                .send(validProductPayload(category.id));

            expect(response.status)
.toBe(401);
        });

        it('should reject duplicate product names', async () => {
            const category = await createCategory();

            await createProduct(category.id, {
                name: 'Unique Product',
            });

            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...validProductPayload(category.id),
                    name: 'Unique Product',
                });

            expect(response.status)
.toBe(409);

            expect(response.body.message)
.toBe('Product with this name already exists');
        });

        it('should return 404 when category does not exist', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send(validProductPayload('507f1f77bcf86cd799439011'));

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Category not found');
        });

        it('should trim the product name', async () => {
            const category = await createCategory();
            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...validProductPayload(category.id),
                    name: '  Trimmed Product  ',
                });

            expect(response.status)
.toBe(201);

            expect(response.body.data.name)
.toBe('Trimmed Product');
        });

        it('should reject invalid product data', async () => {
            const category = await createCategory();
            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: '',
                    description: '',
                    price: -10,
                    stock: -1,
                    category: category.id,
                });

            expect(response.status)
.toBe(400);
        });

        it('should reject discount price greater than regular price', async () => {
            const category = await createCategory();
            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...validProductPayload(category.id),
                    price: 50,
                    discountPrice: 100,
                });

            expect(response.status)
.toBe(400);
        });
    });

    describe('PUT /api/products/:id', () => {
        it('should update a product', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const token = await getAuthToken();

            const response = await request(app)
                .put(`/api/products/${product.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Product',
                    price: 149.99,
                });

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toMatchObject({
                name: 'Updated Product',
                price: 149.99,
            });

            expect(response.body.message)
.toBe('Product updated successfully');

            const updatedProduct = await ProductModel.findById(product.id);

            expect(updatedProduct?.name)
.toBe('Updated Product');
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
.put(`/api/products/${product.id}`)
.send({
                name: 'Updated Product',
            });

            expect(response.status)
.toBe(401);
        });

        it('should return 404 for a non-existing product', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .put('/api/products/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Product',
                });

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Product not found');
        });

        it('should reject duplicate product names', async () => {
            const category = await createCategory();

            await createProduct(category.id, {
                name: 'Existing Product',
            });

            const product = await createProduct(category.id, {
                name: 'Another Product',
            });

            const token = await getAuthToken();

            const response = await request(app)
                .put(`/api/products/${product.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Existing Product',
                });

            expect(response.status)
.toBe(409);

            expect(response.body.message)
.toBe('Product with this name already exists');
        });

        it('should return 404 when updating to a non-existing category', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const token = await getAuthToken();

            const response = await request(app)
                .put(`/api/products/${product.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    category: '507f1f77bcf86cd799439011',
                });

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Category not found');
        });

        it('should reject an empty update body', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const token = await getAuthToken();

            const response = await request(app)
                .put(`/api/products/${product.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(response.status)
.toBe(400);
        });

        it('should reject an invalid product id', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .put('/api/products/invalid-id')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated',
                });

            expect(response.status)
.toBe(400);
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('should delete a product', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const token = await getAuthToken();

            const response = await request(app)
                .delete(`/api/products/${product.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(200);

            expect(response.body.message)
.toBe('Product deleted successfully');

            const deletedProduct = await ProductModel.findById(product.id);

            expect(deletedProduct)
.toBeNull();
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
.delete(`/api/products/${product.id}`);

            expect(response.status)
.toBe(401);
        });

        it('should return 404 for a non-existing product', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .delete('/api/products/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Product not found');
        });

        it('should reject an invalid product id', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .delete('/api/products/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(400);
        });
    });
});
