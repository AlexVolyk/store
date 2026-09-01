import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { CategoryModel } from '../src/models/index.ts';
import { clearTestDatabase, createTestCategory, createTestUser } from './helpers/testSeeds.ts';

describe('Category API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe('GET /api/categories', () => {
        it('should return all categories without authentication', async () => {
            await createTestCategory('Living');
            await createTestCategory('Audio');

            const response = await request(app).get('/api/categories');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.message).toBe('Categories fetched successfully');
        });

        it('should return an empty array when there are no categories', async () => {
            const response = await request(app).get('/api/categories');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('GET /api/categories/:id', () => {
        it('should return a category by id', async () => {
            const category = await createTestCategory('Cameras');

            const response = await request(app).get(`/api/categories/${category._id}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toMatchObject({
                name: 'Cameras',
            });
        });

        it('should return 404 for a non-existing category', async () => {
            const response = await request(app).get('/api/categories/66d2a1b490f8234a91bc9999');
            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/categories (Admin Only)', () => {
        it('should allow admin to create a category', async () => {
            const { token: adminToken } = await createTestUser('admin');

            const response = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Wearables',
                    description: 'Smart luxury timepieces and rings',
                });

            expect(response.status).toBe(201);
            expect(response.body.data).toMatchObject({
                name: 'Wearables',
                slug: 'wearables',
            });

            const dbCategory = await CategoryModel.findOne({ name: 'Wearables' });
            expect(dbCategory).not.toBeNull();
        });

        it('should reject non-admin users with 403 Forbidden', async () => {
            const { token: userToken } = await createTestUser('user');

            const response = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Hacked Category',
                });

            expect(response.status).toBe(403);
        });

        it('should reject unauthenticated requests with 401', async () => {
            const response = await request(app)
                .post('/api/categories')
                .send({
                    name: 'Unauthorized Category',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/categories/:id (Admin Only)', () => {
        it('should update a category by id', async () => {
            const category = await createTestCategory('Old Category');
            const { token: adminToken } = await createTestUser('admin');

            const response = await request(app)
                .put(`/api/categories/${category._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Luxury Category',
                    description: 'Updated description',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Luxury Category');
        });
    });

    describe('DELETE /api/categories/:id (Admin Only)', () => {
        it('should delete a category by id', async () => {
            const category = await createTestCategory('Delete Me');
            const { token: adminToken } = await createTestUser('admin');

            const response = await request(app)
                .delete(`/api/categories/${category._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Category deleted successfully');

            const dbCategory = await CategoryModel.findById(category._id);
            expect(dbCategory).toBeNull();
        });
    });
});
