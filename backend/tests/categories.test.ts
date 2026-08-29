import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app.ts';
import { CategoryModel, UserModel } from '../src/models/index.ts';
import { getToken } from '../src/utils/index.ts';

describe('Category API', () => {
    beforeEach(async () => {
        await CategoryModel.deleteMany({});
        await UserModel.deleteMany({});
    });

    const createUser = async () => {
        return UserModel.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com',
            password: 'Password123!',
        });
    };

    const createCategory = async (overrides = {}) => {
        return CategoryModel.create({
            name: 'Electronics',
            description: 'Electronic products',
            ...overrides,
        });
    };

    const getAuthToken = async () => {
        const user = await createUser();

        return getToken(user.id);
    };

    describe('GET /api/categories', () => {
        it('should return all categories', async () => {
            await createCategory({
                name: 'Electronics',
            });

            await createCategory({
                name: 'Clothing',
            });

            const response = await request(app)
.get('/api/categories');

            expect(response.status)
.toBe(200);

            expect(response.body)
.toHaveProperty('data');
            expect(Array.isArray(response.body.data))
.toBe(true);

            expect(response.body.data)
.toHaveLength(2);

            expect(response.body.data)
.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Electronics',
                        description: 'Electronic products',
                    }),
                    expect.objectContaining({
                        name: 'Clothing',
                    }),
                ]),
            );

            expect(response.body.message)
.toBe('Categories fetched successfully');
        });

        it('should return an empty array when there are no categories', async () => {
            const response = await request(app)
.get('/api/categories');

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toEqual([]);

            expect(response.body.message)
.toBe('No categories yet');
        });
    });

    describe('GET /api/categories/:id', () => {
        it('should return a category by id', async () => {
            const category = await createCategory();

            const response = await request(app)
.get(`/api/categories/${category.id}`);

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toMatchObject({
                name: 'Electronics',
                description: 'Electronic products',
            });

            expect(response.body.message)
.toBe('Category fetched successfully');
        });

        it('should return 404 for a non-existing category', async () => {
            const response = await request(app)
.get('/api/categories/507f1f77bcf86cd799439011');

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Category not found');
        });

        it('should reject an invalid category id', async () => {
            const response = await request(app)
.get('/api/categories/invalid-id');

            expect(response.status)
.toBe(400);
        });
    });

    describe('POST /api/categories', () => {
        it('should create a category', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Electronics',
                    description: 'Electronic products',
                });

            expect(response.status)
.toBe(201);

            expect(response.body.data)
.toMatchObject({
                name: 'Electronics',
                description: 'Electronic products',
            });

            expect(response.body.message)
.toBe('Category created successfully');

            const category = await CategoryModel.findOne({
                name: 'Electronics',
            });

            expect(category).not.toBeNull();
        });

        it('should reject unauthenticated requests', async () => {
            const response = await request(app)
.post('/api/categories')
.send({
                name: 'Electronics',
            });

            expect(response.status)
.toBe(401);
        });

        it('should reject duplicate category names', async () => {
            await createCategory({
                name: 'Electronics',
            });

            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Electronics',
                });

            expect(response.status)
.toBe(409);

            expect(response.body.message)
.toBe('Category with this name already exists');
        });

        it('should trim the category name', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: '  Electronics  ',
                });

            expect(response.status)
.toBe(201);

            expect(response.body.data.name)
.toBe('Electronics');
        });

        it('should reject invalid category data', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: '',
                });

            expect(response.status)
.toBe(400);
        });
    });

    describe('PUT /api/categories/:id', () => {
        it('should update a category', async () => {
            const category = await createCategory();

            const token = await getAuthToken();

            const response = await request(app)
                .put(`/api/categories/${category.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Electronics',
                    description: 'Updated description',
                });

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toMatchObject({
                name: 'Updated Electronics',
                description: 'Updated description',
            });

            expect(response.body.message)
.toBe('Category updated successfully');

            const updatedCategory = await CategoryModel.findById(category.id);

            expect(updatedCategory?.name)
.toBe('Updated Electronics');
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();

            const response = await request(app)
.put(`/api/categories/${category.id}`)
.send({
                name: 'Updated Electronics',
            });

            expect(response.status)
.toBe(401);
        });

        it('should return 404 for a non-existing category', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .put('/api/categories/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Electronics',
                });

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Category not found');
        });

        it('should reject duplicate category names', async () => {
            await createCategory({
                name: 'Electronics',
            });

            const category = await createCategory({
                name: 'Clothing',
            });

            const token = await getAuthToken();

            const response = await request(app)
                .put(`/api/categories/${category.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Electronics',
                });

            expect(response.status)
.toBe(409);

            expect(response.body.message)
.toBe('Category with this name already exists');
        });

        it('should reject an invalid category id', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .put('/api/categories/invalid-id')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated',
                });

            expect(response.status)
.toBe(400);
        });
    });

    describe('DELETE /api/categories/:id', () => {
        it('should delete a category', async () => {
            const category = await createCategory();

            const token = await getAuthToken();

            const response = await request(app)
                .delete(`/api/categories/${category.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(200);

            expect(response.body.message)
.toBe('Category deleted successfully');

            const deletedCategory = await CategoryModel.findById(category.id);

            expect(deletedCategory)
.toBeNull();
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();

            const response = await request(app)
.delete(`/api/categories/${category.id}`);

            expect(response.status)
.toBe(401);
        });

        it('should return 404 for a non-existing category', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .delete('/api/categories/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Category not found');
        });

        it('should reject an invalid category id', async () => {
            const token = await getAuthToken();

            const response = await request(app)
                .delete('/api/categories/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(400);
        });
    });
});
