import z from "zod";

export const updateUserSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

export const userSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  updatedAt: z.date(),
});
