/**
 * Tipos relacionados à autenticação
 */

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

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}




