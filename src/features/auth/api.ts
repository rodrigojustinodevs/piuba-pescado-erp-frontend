import axios from 'axios';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import type { LoginCredentials, LoginResponse } from './types';

/**
 * Cliente axios configurado para a API de autenticação
 */
const authApi = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor: traduz erros da API (backend pode vir em inglês) para mensagens
 * em português do ErrorMessages. O usuário sempre vê texto em PT.
 */
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error) || !error.response) {
      return Promise.reject(error);
    }
    const status = error.response.status;

    if (status === 400) {
      return Promise.reject(new Error(ErrorMessages.LOGIN_REQUIRED_FIELDS));
    }
    if (status === 401) {
      return Promise.reject(new Error(ErrorMessages.LOGIN_CREDENTIALS));
    }
    if (status >= 500) {
      return Promise.reject(new Error(ErrorMessages.LOGIN_SERVER_ERROR));
    }
    return Promise.reject(new Error(ErrorMessages.UNEXPECTED));
  },
);

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Realiza o login do usuário
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await authApi.post<LoginResponse>('/', credentials);
    return response.data;
  },

  /**
   * Realiza o logout do usuário
   */
  async logout(): Promise<{ ok: boolean }> {
    const response = await authApi.post<{ ok: boolean }>('/logout');
    return response.data;
  },

  /**
   * Verifica se o usuário está autenticado e retorna dados do usuário
   */
  async checkAuth(): Promise<{ isAuthenticated: boolean; user?: import('./types').User }> {
    try {
      const response = await authApi.get<{
        isAuthenticated: boolean;
        user?: import('./types').User;
      }>('/');
      if (response.data.isAuthenticated && response.data.user) {
        console.log('✅ Usuário autenticado - Tipo:', response.data.user.role);
        console.log('📦 [Auth API] Dados completos do usuário recebidos:', {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          companyId: response.data.user.companyId,
          rawResponse: response.data,
        });
      }
      return response.data;
    } catch (error) {
      console.error('❌ [Auth API] Erro ao verificar autenticação:', error);
      return { isAuthenticated: false };
    }
  },
};
