import { z } from 'zod';

export const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

export const idParamsSchema = z.object({
    id: objectIdSchema,
});

export const idOrSlugParamsSchema = z.object({
    id: z
        .string()
        .trim()
        .min(1, 'Identifier is required'),
});

export const productIdParamsSchema = z.object({
    productId: objectIdSchema,
});

export type IdParamsDTO = z.infer<typeof idParamsSchema>;
export type IdOrSlugParamsDTO = z.infer<typeof idOrSlugParamsSchema>;
export type ProductIdParamsDTO = z.infer<typeof productIdParamsSchema>;
