import { z } from 'zod';

export const addCartItemSchema = z.object({
    productId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),

    quantity: z
        .number()
        .int('Quantity must be an integer')
        .min(1, 'Quantity must be greater than 0')
        .default(1),
});

export const updateCartItemSchema = z.object({
    quantity: z
        .number()
        .int('Quantity must be an integer')
        .min(1, 'Quantity must be greater than 0'),
});

export type AddCartItemDTO = z.infer<typeof addCartItemSchema>;

export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>;
