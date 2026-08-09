import { z } from "zod";

export const wishlistProductParamsSchema = z.object({
    productId: z.string().min(1, "Product id is required"),
});

export type WishlistProductParams = z.infer<typeof wishlistProductParamsSchema>;