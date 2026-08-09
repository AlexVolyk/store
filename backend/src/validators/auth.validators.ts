import { z } from "zod";

export const registerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must contain at least 2 characters"),

    lastName: z
        .string()
        .trim()
        .min(2, "Last name must contain at least 2 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters"),

    phone: z
        .string()
        .trim()
        .optional(),

    avatar: z
        .string()
        .url("Avatar must be a valid URL")
        .optional(),
});


export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(1, "Password is required"),
});

export type RegisterUserDTO = z.infer<typeof registerSchema>;

export type LoginUserDTO = z.infer<typeof loginSchema>;