import z from 'zod';

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Category name is required')
        .max(100, 'Category name is too long'),

    slug: z
        .string()
        .trim()
        .toLowerCase()
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),
});

export const updateCategorySchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Category name cannot be empty')
            .max(100, 'Category name is too long')
            .optional(),

        slug: z
            .string()
            .trim()
            .toLowerCase()
            .optional(),

        description: z
            .string()
            .trim()
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one category field is required for update',
    });

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
