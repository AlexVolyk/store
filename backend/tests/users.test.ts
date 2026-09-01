import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { UserModel } from '../src/models/index.ts';
import { clearTestDatabase, createTestUser } from './helpers/testSeeds.ts';

describe('User API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe('GET /api/users/me', () => {
        it('should return the currently authenticated user profile', async () => {
            const { token } = await createTestUser('user', 'me@test.com');

            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
                email: 'me@test.com',
                firstName: 'Test',
                lastName: 'User',
                role: 'user',
            });
            expect(response.body.data).not.toHaveProperty('password');
        });

        it('should reject unauthenticated request with 401', async () => {
            const response = await request(app).get('/api/users/me');
            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/users/me', () => {
        it('should update the authenticated user profile', async () => {
            const { user, token } = await createTestUser('user', 'update_me@test.com');

            const response = await request(app)
                .put('/api/users/me')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'Alexander',
                    lastName: 'Volyk',
                    phone: '0987654321',
                    shippingAddress: {
                        street: '456 Luxury Blvd',
                        city: 'New York',
                        postalCode: '10001',
                        country: 'United States',
                    },
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toMatchObject({
                firstName: 'Alexander',
                lastName: 'Volyk',
                phone: '0987654321',
                shippingAddress: {
                    street: '456 Luxury Blvd',
                    city: 'New York',
                    postalCode: '10001',
                    country: 'United States',
                },
            });

            const dbUser = await UserModel.findById(user._id);
            expect(dbUser?.firstName).toBe('Alexander');
            expect(dbUser?.shippingAddress?.city).toBe('New York');
        });
    });

    describe('GET /api/users (Admin Only)', () => {
        it('should allow admin to list all users', async () => {
            const { token: adminToken } = await createTestUser('admin', 'admin_list@test.com');
            await createTestUser('user', 'customer1@test.com');
            await createTestUser('user', 'customer2@test.com');

            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThanOrEqual(3);
        });

        it('should reject non-admin users with 403 Forbidden', async () => {
            const { token: userToken } = await createTestUser('user', 'regular@test.com');

            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body.message).toContain('Access denied');
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return a user by ID for authorized user', async () => {
            const { user, token } = await createTestUser('user', 'lookup@test.com');

            const response = await request(app)
                .get(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(user._id.toString());
        });

        it('should return 404 for a non-existing valid ObjectId', async () => {
            const { token } = await createTestUser('admin', 'admin_lookup@test.com');

            const response = await request(app)
                .get('/api/users/66d2a1b490f8234a91bc9999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update a user by ID', async () => {
            const { user, token } = await createTestUser('user', 'put_id@test.com');

            const response = await request(app)
                .put(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'UpdatedName',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.firstName).toBe('UpdatedName');
        });
    });

    describe('DELETE /api/users/:id (Admin Only)', () => {
        it('should allow admin to delete a user', async () => {
            const { token: adminToken } = await createTestUser('admin', 'admin_del@test.com');
            const { user: userToDelete } = await createTestUser('user', 'todelete@test.com');

            const response = await request(app)
                .delete(`/api/users/${userToDelete._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');

            const dbUser = await UserModel.findById(userToDelete._id);
            expect(dbUser).toBeNull();
        });

        it('should prevent non-admin from deleting users', async () => {
            const { token: userToken } = await createTestUser('user', 'hacker@test.com');
            const { user: targetUser } = await createTestUser('user', 'victim@test.com');

            const response = await request(app)
                .delete(`/api/users/${targetUser._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
        });
    });
});
