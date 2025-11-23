/**
 * Barrel export para o módulo de autenticação
 */

// Types
export type { LoginCredentials, LoginResponse, User, AuthState } from "./types";

// Schemas
export { loginSchema } from "./schemas";
export type { LoginFormData } from "./schemas";

// API
export { authService } from "./api";

// Hooks
export { useAuth } from "./hooks/useAuth";
export { useLogin } from "./hooks/useLogin";




