/**
 * Tipos relacionados à autenticação
 */

import type { AuthenticatedUser, AuthState as SharedAuthState } from '@/shared/types/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Resposta da API de login
 */
export interface ApiLoginResponse {
  status: boolean;
  response: {
    token: string;
  };
  message: string;
}

/**
 * Resposta formatada para o frontend
 */
export interface LoginResponse {
  ok: boolean;
  message?: string;
  token?: string;
}

/**
 * Tipos compartilhados (fonte única): use `src/shared/types/auth.ts`
 */
export type User = AuthenticatedUser;
export type AuthState = SharedAuthState;
