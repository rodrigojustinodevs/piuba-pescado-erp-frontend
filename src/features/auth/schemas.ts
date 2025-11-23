import { z } from "zod";

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

/**
 * Tipo inferido do schema de login
 */
export type LoginFormData = z.infer<typeof loginSchema>;




