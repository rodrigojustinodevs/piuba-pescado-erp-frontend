/**
 * Barrel export para o módulo de autenticação
 */

// Types
export type { LoginCredentials, LoginResponse, User, AuthState } from './types';

// Schemas
export { loginSchema, forgotPasswordSchema, resetPasswordSchema } from './schemas';
export type {
  LoginFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  ResetPasswordPayload,
} from './schemas';

// API
export { authService } from './api';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';
export { useForgotPassword, useResetPassword } from './hooks/usePasswordRecovery';
