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
