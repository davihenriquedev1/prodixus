import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const changePasswordSchema = z.object({
  curPassword: z.string().min(1, "Current Password is required"),
  newPassword: z
    .string()
    .min(8, "Must contain at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
