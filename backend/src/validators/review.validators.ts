import { z } from 'zod';

export const createReviewSchema = z.object({
    rating: z
        .number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be between 1 and 5')
        .max(5, 'Rating must be between 1 and 5'),

    comment: z
        .string()
        .trim()
        .min(1, 'Review comment is required'),
});

export const updateReviewSchema = z
    .object({
        rating: z
            .number()
            .int('Rating must be an integer')
            .min(1, 'Rating must be between 1 and 5')
            .max(5, 'Rating must be between 1 and 5')
            .optional(),

        comment: z
            .string()
            .trim()
            .min(1, 'Review comment cannot be empty')
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one review field is required',
    });

export type CreateReviewDTO = z.infer<typeof createReviewSchema>;

export type UpdateReviewDTO = z.infer<typeof updateReviewSchema>;
