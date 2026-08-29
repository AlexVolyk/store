import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app.ts';
import { CategoryModel, ProductModel, ReviewModel, UserModel } from '../src/models/index.ts';
import { getToken } from '../src/utils/index.ts';

describe('Review API', () => {
    beforeEach(async () => {
        await ReviewModel.deleteMany({});
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

    const createProduct = async (categoryId: string, overrides = {}) => {
        return ProductModel.create({
            name: `Test Product-${Date.now()}`,
            description: 'Test product description',
            price: 100,
            stock: 10,
            images: [],
            brand: 'Test Brand',
            category: categoryId,
            ...overrides,
        });
    };

    const createReview = async (userId: string, productId: string, overrides = {}) => {
        return ReviewModel.create({
            user: userId,
            product: productId,
            rating: 4,
            comment: 'Great product',
            ...overrides,
        });
    };

    const getAuthToken = async (user?: Awaited<ReturnType<typeof createUser>>) => {
        const authUser = user ?? (await createUser());

        return {
            user: authUser,
            token: getToken(authUser.id),
        };
    };

    const validReviewPayload = {
        rating: 5,
        comment: 'Excellent product, highly recommend!',
    };

    describe('POST /api/products/:productId/reviews', () => {
        it('should create a review and update product rating stats', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const { token } = await getAuthToken();

            const response = await request(app)
                .post(`/api/products/${product.id}/reviews`)
                .set('Authorization', `Bearer ${token}`)
                .send(validReviewPayload);

            expect(response.status)
.toBe(201);

            expect(response.body.data)
.toMatchObject({
                rating: 5,
                comment: 'Excellent product, highly recommend!',
            });

            expect(response.body.message)
.toBe('Review created successfully');

            const review = await ReviewModel.findOne({
                product: product.id,
            });

            expect(review).not.toBeNull();

            const updatedProduct = await ProductModel.findById(product.id);

            expect(updatedProduct?.averageRating)
.toBe(5);
            expect(updatedProduct?.reviewCount)
.toBe(1);
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);

            const response = await request(app)
                .post(`/api/products/${product.id}/reviews`)
                .send(validReviewPayload);

            expect(response.status)
.toBe(401);
        });

        it('should return 404 when product does not exist', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .post('/api/products/507f1f77bcf86cd799439011/reviews')
                .set('Authorization', `Bearer ${token}`)
                .send(validReviewPayload);

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Product not found');
        });

        it('should reject duplicate reviews from the same user', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const { user, token } = await getAuthToken();

            await createReview(user.id, product.id);

            const response = await request(app)
                .post(`/api/products/${product.id}/reviews`)
                .set('Authorization', `Bearer ${token}`)
                .send(validReviewPayload);

            expect(response.status)
.toBe(409);

            expect(response.body.message)
.toBe('You have already reviewed this product');
        });

        it('should reject invalid review data', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const { token } = await getAuthToken();

            const response = await request(app)
                .post(`/api/products/${product.id}/reviews`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    rating: 6,
                    comment: '',
                });

            expect(response.status)
.toBe(400);
        });

        it('should reject an invalid product id', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .post('/api/products/invalid-id/reviews')
                .set('Authorization', `Bearer ${token}`)
                .send(validReviewPayload);

            expect(response.status)
.toBe(400);
        });
    });

    describe('PUT /api/reviews/:id', () => {
        it("should update the review owner's review", async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const { user, token } = await getAuthToken();
            const review = await createReview(user.id, product.id);

            const response = await request(app)
                .put(`/api/reviews/${review.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    rating: 2,
                    comment: 'Updated comment',
                });

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toMatchObject({
                rating: 2,
                comment: 'Updated comment',
            });

            expect(response.body.message)
.toBe('Review updated successfully');

            const updatedProduct = await ProductModel.findById(product.id);

            expect(updatedProduct?.averageRating)
.toBe(2);
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const user = await createUser();
            const review = await createReview(user.id, product.id);

            const response = await request(app)
.put(`/api/reviews/${review.id}`)
.send({
                rating: 3,
            });

            expect(response.status)
.toBe(401);
        });

        it('should reject updates from a non-owner user', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const owner = await createUser();
            const review = await createReview(owner.id, product.id);
            const { token } = await getAuthToken();

            const response = await request(app)
                .put(`/api/reviews/${review.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    rating: 1,
                });

            expect(response.status)
.toBe(403);

            expect(response.body.message)
.toBe('You do not have permission to update this review');
        });

        it('should allow an admin to update any review', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const owner = await createUser();
            const review = await createReview(owner.id, product.id);
            const admin = await createAdmin();
            const token = getToken(admin.id);

            const response = await request(app)
                .put(`/api/reviews/${review.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    rating: 1,
                    comment: 'Admin updated',
                });

            expect(response.status)
.toBe(200);

            expect(response.body.data)
.toMatchObject({
                rating: 1,
                comment: 'Admin updated',
            });
        });

        it('should return 404 for a non-existing review', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .put('/api/reviews/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    rating: 3,
                });

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Review not found');
        });

        it('should reject an empty update body', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const { user, token } = await getAuthToken();
            const review = await createReview(user.id, product.id);

            const response = await request(app)
                .put(`/api/reviews/${review.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(response.status)
.toBe(400);
        });

        it('should reject an invalid review id', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .put('/api/reviews/invalid-id')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    rating: 3,
                });

            expect(response.status)
.toBe(400);
        });
    });

    describe('DELETE /api/reviews/:id', () => {
        it("should delete the review owner's review and recalculate product rating", async () => {
            const category = await createCategory();
            const product = await createProduct(category.id, {
                averageRating: 4,
                reviewCount: 1,
            });
            const { user, token } = await getAuthToken();
            const review = await createReview(user.id, product.id);

            const response = await request(app)
                .delete(`/api/reviews/${review.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(200);

            expect(response.body.message)
.toBe('Review deleted successfully');

            const deletedReview = await ReviewModel.findById(review.id);

            expect(deletedReview)
.toBeNull();

            const updatedProduct = await ProductModel.findById(product.id);

            expect(updatedProduct?.averageRating)
.toBe(0);
            expect(updatedProduct?.reviewCount)
.toBe(0);
        });

        it('should reject unauthenticated requests', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const user = await createUser();
            const review = await createReview(user.id, product.id);

            const response = await request(app)
.delete(`/api/reviews/${review.id}`);

            expect(response.status)
.toBe(401);
        });

        it('should reject deletes from a non-owner user', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const owner = await createUser();
            const review = await createReview(owner.id, product.id);
            const { token } = await getAuthToken();

            const response = await request(app)
                .delete(`/api/reviews/${review.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(403);

            expect(response.body.message)
.toBe('You do not have permission to delete this review');
        });

        it('should allow an admin to delete any review', async () => {
            const category = await createCategory();
            const product = await createProduct(category.id);
            const owner = await createUser();
            const review = await createReview(owner.id, product.id);
            const admin = await createAdmin();
            const token = getToken(admin.id);

            const response = await request(app)
                .delete(`/api/reviews/${review.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(200);

            const deletedReview = await ReviewModel.findById(review.id);

            expect(deletedReview)
.toBeNull();
        });

        it('should return 404 for a non-existing review', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .delete('/api/reviews/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(404);

            expect(response.body.message)
.toBe('Review not found');
        });

        it('should reject an invalid review id', async () => {
            const { token } = await getAuthToken();

            const response = await request(app)
                .delete('/api/reviews/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status)
.toBe(400);
        });
    });
});
