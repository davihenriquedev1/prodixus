import { z } from "zod";

export const updateUserSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    error: "Selecione um tema válido.",
  }),
});

export type UpdateUserSettingsFormData = z.infer<
  typeof updateUserSettingsSchema
>;
