import axios from 'axios';
import type {
  Tank,
  CreateTankData,
  UpdateTankData,
  TankListResponse,
  TankType,
  ApiTankTypeListResponse,
} from '../types';

/**
 * Cliente axios configurado para a API de tanques
 * Usa a rota de proxy do Next.js que faz requisição para o backend
 */
const tankApi = axios.create({
  baseURL: '/api/company/tanks',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Serviço de API para tanques
 */
export const tankService = {
  /**
   * Lista todos os tanques com paginação
   */
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<TankListResponse> {
    const response = await tankApi.get<TankListResponse>('/', { params });
    return response.data;
  },

  /**
   * Lista tanques sem lotes vinculados (disponíveis para transferências).
   * Endpoint: /api/company/tanks/without-batches (proxy Next).
   */
  async listWithoutBatches(params?: {
    page?: number;
    per_page?: number;
  }): Promise<TankListResponse> {
    const response = await tankApi.get<TankListResponse>('/without-batches', { params });
    return response.data;
  },

  /**
   * Busca um tanque por ID
   */
  async getById(id: string): Promise<Tank> {
    const response = await tankApi.get<Tank>(`/${id}`);
    return response.data;
  },

  /**
   * Cria um novo tanque
   */
  async create(data: CreateTankData): Promise<Tank> {
    const response = await tankApi.post<Tank>('/', data);
    return response.data;
  },

  /**
   * Atualiza um tanque existente
   */
  async update(data: UpdateTankData): Promise<Tank> {
    const { id, ...updateData } = data;
    const response = await tankApi.put<Tank>(`/${id}`, updateData);
    return response.data;
  },

  /**
   * Remove um tanque
   */
  async delete(id: string): Promise<void> {
    await tankApi.delete(`/${id}`);
  },

  /**
   * Lista todos os tipos de tanque disponíveis
   */
  async getTankTypes(): Promise<TankType[]> {
    const response = await tankApi.get<ApiTankTypeListResponse>('/tank-types');
    return response.data.response || [];
  },
};
