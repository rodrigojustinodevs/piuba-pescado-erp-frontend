import { z } from 'zod';

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

/**
 * Tipo inferido do schema de login
 */
export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Link inválido'),
    email: z.string().min(1, 'Link inválido').email('Link inválido'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    password_confirmation: z.string().min(1, 'Confirme a senha'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'As senhas não conferem',
    path: ['password_confirmation'],
  });
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormData = Pick<
  ResetPasswordPayload,
  'password' | 'password_confirmation'
>;
