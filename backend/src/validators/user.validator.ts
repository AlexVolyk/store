import { z } from "zod";

export const updateUserSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(2, "First name must be at least 2 characters")
            .optional(),

        lastName: z
            .string()
            .trim()
            .min(2, "Last name must be at least 2 characters")
            .optional(),

        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase()
            .optional(),

        phone: z
            .string()
            .trim()
            .optional(),

        avatar: z
            .string()
            .url("Avatar must be a valid URL")
            .optional(),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one user field is required for update",
        },
    );


export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
