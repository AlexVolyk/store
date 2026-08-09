import z from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required")
        .max(100, "Category name is too long"),
});

export const updateCategorySchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Category name cannot be empty")
            .max(100, "Category name is too long")
    })
    .partial();


export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;