import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';

import { app } from '../src/app.js';
import { UserModel } from '../src/models/index.js';
import { getToken } from '../src/utils/index.js';

describe('User API', () => {
    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    const createUser = async (overrides = {}) => {
        return UserModel.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com',
            password: 'Password123!',
            role: 'admin',
            ...overrides,
        });
    };

    describe('GET /api/users', () => {
        it('should return all users without authentication', async () => {
            await createUser({
                email: 'john@test.com',
            });

            await createUser({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@test.com',
            });

            const response = await request(app)
                .get('/api/users');

            expect(response.status).toBe(200);

            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(2);

            expect(response.body.data).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@test.com',
                    }),
                    expect.objectContaining({
                        firstName: 'Jane',
                        lastName: 'Doe',
                        email: 'jane@test.com',
                    }),
                ]),
            );

            response.body.data.forEach(
                (user: Record<string, unknown>) => {
                    expect(user).not.toHaveProperty('password');
                },
            );
        });

        it('should return an empty array when there are no users', async () => {
            const response = await request(app)
                .get('/api/users');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('PUT /api/users/update/:id', () => {
        it('should reject an expired token', async () => {
            const user = await createUser();

            const expiredToken = jwt.sign(
                { id: user.id },
                env.jwtSecret,
                { expiresIn: -1 },
            );

            const response = await request(app)
                .put(`/api/users/update/${user.id}`)
                .set('Authorization', `Bearer ${expiredToken}`)
                .send({
                    firstName: 'Updated',
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid token');
        });
    });


    describe('PUT /api/users/update/:id', () => {
        it('should update a user', async () => {
            const currentUser = await createUser();

            const token = getToken(currentUser.id);

            const response = await request(app)
                .put(`/api/users/update/${currentUser.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'Updated',
                    lastName: 'User',
                });

            expect(response.status).toBe(200);

            expect(response.body.data).toMatchObject({
                firstName: 'Updated',
                lastName: 'User',
                email: 'john@test.com',
            });

            expect(response.body.data).not.toHaveProperty('password');

            const updatedUser = await UserModel.findById(currentUser.id);

            expect(updatedUser?.firstName).toBe('Updated');
            expect(updatedUser?.lastName).toBe('User');
        });

        it('should reject unauthenticated requests', async () => {
            const user = await createUser();

            const response = await request(app)
                .put(`/api/users/update/${user.id}`)
                .send({
                    firstName: 'Updated',
                });

            expect(response.status).toBe(401);
        });

        it('should reject invalid update data', async () => {
            const user = await createUser();

            const token = getToken(user.id);

            const response = await request(app)
                .put(`/api/users/update/${user.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: '',
                });

            expect(response.status).toBe(400);
        });

        it('should return 404 for a non-existing user', async () => {
            const user = await createUser();

            const token = getToken(user.id);

            const response = await request(app)
                .put('/api/users/update/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'Updated',
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/users/delete/:id', () => {
        it('should delete a user', async () => {
            const user = await createUser();

            const token = getToken(user.id);

            const response = await request(app)
                .delete(`/api/users/delete/${user.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body).toHaveProperty(
                'message',
                'User deleted successfully',
            );

            const deletedUser = await UserModel.findById(user.id);

            expect(deletedUser).toBeNull();
        });

        it('should reject unauthenticated requests', async () => {
            const user = await createUser();

            const response = await request(app)
                .delete(`/api/users/delete/${user.id}`);
            expect(response.status).toBe(401);
        });

        it('should return 404 for a non-existing user', async () => {
            const user = await createUser();

            const token = getToken(user.id);

            const response = await request(app)
                .delete('/api/users/delete/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});