import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.email("Informe um e-mail válido."),
});

export const changePasswordSchema = z
  .object({
    curPassword: z.string().min(1, "Informe sua senha atual."),
    newPassword: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .regex(/[A-Z]/, "Inclua pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "Inclua pelo menos uma letra minúscula.")
      .regex(/[0-9]/, "Inclua pelo menos um número."),
    confirmPassword: z.string().min(1, "Confirme sua nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.curPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da atual.",
    path: ["newPassword"],
  });
