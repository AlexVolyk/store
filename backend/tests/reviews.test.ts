import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.ts';
import { ProductModel, ReviewModel } from '../src/models/index.ts';
import {
    clearTestDatabase,
    createTestCategory,
    createTestOrder,
    createTestProduct,
    createTestUser,
} from './helpers/testSeeds.ts';

describe('Review API', () => {
    beforeEach(async () => {
        await clearTestDatabase();
    });

    const validReviewPayload = {
        rating: 5,
        comment: 'Tactile excellence and pristine craftsmanship.',
    };

    describe('GET /api/reviews/:productId', () => {
        it('should fetch all reviews for a product without auth', async () => {
            const category = await createTestCategory('Audio');
            const product = await createTestProduct(category._id.toString());
            const { user } = await createTestUser('user');

            await ReviewModel.create({
                user: user._id,
                product: product._id,
                rating: 5,
                comment: 'Great audio clarity',
                isVerifiedPurchase: false,
            });

            const response = await request(app).get(`/api/reviews/${product._id}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].comment).toBe('Great audio clarity');
        });
    });

    describe('POST /api/reviews/:productId', () => {
        it('should create a review and update product averageRating', async () => {
            const category = await createTestCategory('Audio');
            const product = await createTestProduct(category._id.toString());
            const { token } = await createTestUser('user');

            const response = await request(app)
                .post(`/api/reviews/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(validReviewPayload);

            expect(response.status).toBe(201);
            expect(response.body.data).toMatchObject({
                rating: 5,
                comment: 'Tactile excellence and pristine craftsmanship.',
            });

            const updatedProduct = await ProductModel.findById(product._id);
            expect(updatedProduct?.averageRating).toBe(5);
            expect(updatedProduct?.reviewCount).toBe(1);
        });

        it('should block duplicate reviews from the same user with 409', async () => {
            const category = await createTestCategory('Cameras');
            const product = await createTestProduct(category._id.toString());
            const { token } = await createTestUser('user');

            // 1st review
            await request(app)
                .post(`/api/reviews/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(validReviewPayload);

            // 2nd duplicate review
            const response = await request(app)
                .post(`/api/reviews/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(validReviewPayload);

            expect(response.status).toBe(409);
            expect(response.body.message).toBe('You have already reviewed this product');
        });

        it('should automatically set isVerifiedPurchase to true when user bought product', async () => {
            const category = await createTestCategory('Wearables');
            const product = await createTestProduct(category._id.toString());
            const { user, token } = await createTestUser('user');

            // Seed delivered order for this user and product
            await createTestOrder(user._id.toString(), product._id.toString(), {
                orderStatus: 'delivered',
            });

            const response = await request(app)
                .post(`/api/reviews/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(validReviewPayload);

            expect(response.status).toBe(201);
            expect(response.body.data.isVerifiedPurchase).toBe(true);
        });

        it('should reject invalid rating numbers (e.g. 6 or 0)', async () => {
            const category = await createTestCategory('Wearables');
            const product = await createTestProduct(category._id.toString());
            const { token } = await createTestUser('user');

            const response = await request(app)
                .post(`/api/reviews/${product._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    rating: 6,
                    comment: 'Invalid rating test',
                });

            expect(response.status).toBe(400);
        });

        it('should reject unauthenticated request with 401', async () => {
            const category = await createTestCategory('Cameras');
            const product = await createTestProduct(category._id.toString());

            const response = await request(app)
                .post(`/api/reviews/${product._id}`)
                .send(validReviewPayload);

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/reviews/:id', () => {
        it('should allow review owner to update their review', async () => {
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString());
            const { user, token } = await createTestUser('user');

            const review = await ReviewModel.create({
                user: user._id,
                product: product._id,
                rating: 3,
                comment: 'Initial comment',
            });

            const response = await request(app)
                .put(`/api/reviews/${review._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    rating: 5,
                    comment: 'Updated amazing comment',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.rating).toBe(5);

            const updatedProduct = await ProductModel.findById(product._id);
            expect(updatedProduct?.averageRating).toBe(5);
        });
    });

    describe('DELETE /api/reviews/:id', () => {
        it('should delete a review and recalculate product average rating', async () => {
            const category = await createTestCategory('Living');
            const product = await createTestProduct(category._id.toString(), {
                averageRating: 5,
                reviewCount: 1,
            });
            const { user, token } = await createTestUser('user');

            const review = await ReviewModel.create({
                user: user._id,
                product: product._id,
                rating: 5,
                comment: 'To be deleted',
            });

            const response = await request(app)
                .delete(`/api/reviews/${review._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Review deleted successfully');

            const deletedReview = await ReviewModel.findById(review._id);
            expect(deletedReview).toBeNull();

            const updatedProduct = await ProductModel.findById(product._id);
            expect(updatedProduct?.averageRating).toBe(0);
            expect(updatedProduct?.reviewCount).toBe(0);
        });
    });
});
