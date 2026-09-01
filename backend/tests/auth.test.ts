import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app.ts';
import { UserModel } from '../src/models/index.ts';
import { clearTestDatabase } from './helpers/testSeeds.ts';

describe('Auth API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
.post('/api/auth/register')
.send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                password: 'Password123!',
                phone: '380991234567',
            });

            expect(response.status)
.toBe(201);

            expect(response.body)
.toHaveProperty('message', 'User registered successfully');

            expect(response.body)
.toHaveProperty('data');
            expect(response.body)
.toHaveProperty('token');

            expect(response.body.data)
.toMatchObject({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                role: 'user',
            });

            // Password must never be returned
            expect(response.body.data).not.toHaveProperty('password');

            // Verify the user was actually created in MongoDB
            const user = await UserModel.findOne({
                email: 'john@test.com',
            });

            expect(user).not.toBeNull();
            expect(user?.firstName)
.toBe('John');
            expect(user?.lastName)
.toBe('Doe');

            // Password should be hashed, not stored as plain text
            expect(user?.password).not.toBe('Password123!');
        });

        it('should not register a user with an existing email', async () => {
            await UserModel.create({
                firstName: 'Existing',
                lastName: 'User',
                email: 'john@test.com',
                password: 'hashed-password',
            });

            const response = await request(app)
.post('/api/auth/register')
.send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                password: 'Password123!',
            });

            expect(response.status)
.toBe(409);

            expect(response.body)
.toHaveProperty('message', 'Email is already in use');
        });

        it('should reject invalid registration data', async () => {
            const response = await request(app)
.post('/api/auth/register')
.send({
                firstName: '',
                lastName: '',
                email: 'invalid-email',
                password: '123',
            });

            expect(response.status)
.toBe(400);

            expect(response.body)
.toHaveProperty('message');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app)
.post('/api/auth/register')
.send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                password: 'Password123!',
            });
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
.post('/api/auth/login')
.send({
                email: 'john@test.com',
                password: 'Password123!',
            });

            expect(response.status)
.toBe(200);

            expect(response.body)
.toHaveProperty('message', 'User has successfully logged in');

            expect(response.body)
.toHaveProperty('token');
            expect(typeof response.body.token)
.toBe('string');

            expect(response.body)
.toHaveProperty('data');

            expect(response.body.data)
.toMatchObject({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                role: 'user',
            });

            expect(response.body.data).not.toHaveProperty('password');
        });

        it('should reject incorrect password', async () => {
            const response = await request(app)
.post('/api/auth/login')
.send({
                email: 'john@test.com',
                password: 'WrongPassword123!',
            });

            expect(response.status)
.toBe(401);

            expect(response.body)
.toHaveProperty('message');
        });

        it('should reject a non-existing user', async () => {
            const response = await request(app)
.post('/api/auth/login')
.send({
                email: 'doesnotexist@test.com',
                password: 'Password123!',
            });

            expect(response.status)
.toBe(401);

            expect(response.body)
.toHaveProperty('message');
        });

        it('should reject invalid login data', async () => {
            const response = await request(app)
.post('/api/auth/login')
.send({
                email: 'invalid-email',
                password: '',
            });

            expect(response.status)
.toBe(400);

            expect(response.body)
.toHaveProperty('message');
        });
    });
});
