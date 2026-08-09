import { z } from "zod";

export const productSchema  = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name is required"),

    description: z
        .string()
        .trim()
        .min(1, "Product description is required"),

    price: z
        .number()
        .min(0, "Product price cannot be negative"),

    discountPrice: z
        .number()
        .min(0, "Discount price cannot be negative")
        .optional(),

    stock: z
        .number()
        .int("Stock must be an integer")
        .min(0, "Product stock cannot be negative"),

    images: z
        .array(z.string())
        .optional(),

    brand: z
        .string()
        .trim()
        .optional(),

    category: z
        .string()
        .min(1, "Category is required"),

    isActive: z
        .boolean()
        .optional(),
});

export const createProductSchema = productSchema
    .refine(
        (data) =>
            data.discountPrice === undefined ||
            data.discountPrice <= data.price,
        {
            message:
                'Discount price cannot be greater than regular price',
            path: ['discountPrice'],
        },
    );

export const updateProductSchema = productSchema 
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one product field is required for update",
        },
    )
    .refine(
        (data) =>
            data.discountPrice === undefined ||
            data.price === undefined ||
            data.discountPrice <= data.price,
        {
            message: "Discount price cannot be greater than regular price",
            path: ["discountPrice"],
        },
    );

export const productQuerySchema = z.object({
    category: z.string().optional(),

    search: z.string().trim().optional(),

    minPrice: z.coerce
        .number()
        .min(0)
        .optional(),

    maxPrice: z.coerce
        .number()
        .min(0)
        .optional(),

    sort: z
        .enum([
            "newest",
            "oldest",
            "price_asc",
            "price_desc",
            "rating",
        ])
        .optional(),


    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10),
});


export type CreateProductDTO = z.infer<typeof createProductSchema>;

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;

export type ProductQueryDTO = z.infer<typeof productQuerySchema>;