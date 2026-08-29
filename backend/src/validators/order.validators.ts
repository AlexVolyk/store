import { z } from 'zod';
import { ORDER_STATUSES } from '../types/index.ts';

export const createOrderSchema = z.object({
    items: z
        .array(
            z.object({
                product: z
                    .string()
                    .min(1, 'Product id is required'),

                quantity: z
                    .number()
                    .int('Quantity must be an integer')
                    .min(1, 'Quantity must be at least 1'),
            }),
        )
        .min(1, 'Order must contain at least one item'),

    shippingAddress: z.object({
        fullName: z
            .string()
            .trim()
            .min(1, 'Full name is required'),

        phone: z
            .string()
            .trim()
            .min(1, 'Phone is required'),

        city: z
            .string()
            .trim()
            .min(1, 'City is required'),

        postalCode: z
            .string()
            .trim()
            .min(1, 'Postal code is required'),

        addressLine: z
            .string()
            .trim()
            .min(1, 'Address is required'),

        country: z
            .string()
            .trim()
            .min(1, 'Country is required'),
    }),

    notes: z
        .string()
        .trim()
        .optional(),

    paymentMethod: z
        .string()
        .trim()
        .min(1, 'Payment method is required'),

    shippingPrice: z
        .number()
        .min(0)
        .optional(),

    taxPrice: z
        .number()
        .min(0)
        .optional(),
});

export const updateOrderStatusSchema = z.object({
    orderStatus: z.enum(ORDER_STATUSES),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>;
