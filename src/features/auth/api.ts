import axios from "axios";
import type { LoginCredentials, LoginResponse } from "./types";

/**
 * Cliente axios configurado para a API de autenticação
 */
const authApi = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Realiza o login do usuário
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await authApi.post<LoginResponse>("/", credentials);
    return response.data;
  },

  /**
   * Realiza o logout do usuário
   */
  async logout(): Promise<{ ok: boolean }> {
    const response = await authApi.post<{ ok: boolean }>("/logout");
    return response.data;
  },

  /**
   * Verifica se o usuário está autenticado
   */
  async checkAuth(): Promise<{ isAuthenticated: boolean }> {
    try {
      const response = await authApi.get("/");
      return { isAuthenticated: response.status === 200 };
    } catch {
      return { isAuthenticated: false };
    }
  },
};

