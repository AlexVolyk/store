import { z } from "zod";

export const objectIdSchema = z
    .string()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid ID",
    );

export const idParamsSchema = z.object({
    id: objectIdSchema,
});

export const productIdParamsSchema = z.object({
    productId: objectIdSchema,
});

export type IdParamsDTO = z.infer<typeof idParamsSchema>;
export type ProductIdParamsDTO = z.infer<typeof productIdParamsSchema>;
