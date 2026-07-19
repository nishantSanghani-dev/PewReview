import z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/,
            "Password must contain at least one special character"
        ),
})

export const roleSchema = z.object({
    roleName: z
        .string()
        .trim()
        .min(1, "Role name is required"),
    description: z
        .string()
        .trim()
        .min(1, "Description  is required")

})

export const userSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required"),
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required"),
    birthDay: z
        .string()
        .optional()
        .refine(val => !val || !isNaN(Date.parse(val)), "Invalid date"),
    gender: z
        .string()
        .optional(),
    userName: z
        .string()
        .trim()
        .min(1, "Username is required")
        .min(3, "Username must be at least 3 characters"),
    address: z
        .string()
        .optional(),
    contactNumber: z
        .string()
        .trim()
        .min(1, "Contact number is required")
        .regex(/^\d+$/, "Contact number must contain only digits")
        .min(10, "Contact number must be at least 10 digits"),
    countryCode: z
        .string()
        .min(1, "Country code is required"),
    email: z
        .string()
        .email("Please enter a valid email address"),
    role: z
        .string()
        .optional(),
    profileImage: z
        .any()
        .optional()
})