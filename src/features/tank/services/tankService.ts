import type { Tank, CreateTankData, UpdateTankData, TankListResponse, TankType } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';

export const tankService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<TankListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params?.limit !== undefined) {
      searchParams.set('limit', String(params.limit));
    }
    if (params?.search !== undefined && params.search !== '') {
      searchParams.set('search', params.search);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/company/tanks?${queryString}` : '/api/company/tanks';
    return browserHttpClient.get<TankListResponse>(endpoint);
  },

  async listWithoutBatches(params?: {
    page?: number;
    per_page?: number;
  }): Promise<TankListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params?.per_page !== undefined) {
      searchParams.set('per_page', String(params.per_page));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/company/tanks/without-batches?${queryString}`
      : '/api/company/tanks/without-batches';
    return browserHttpClient.get<TankListResponse>(endpoint);
  },

  async getById(id: string): Promise<Tank> {
    return browserHttpClient.get<Tank>(`/api/company/tanks/${id}`);
  },

  async create(data: CreateTankData): Promise<Tank> {
    return browserHttpClient.post<Tank>('/api/company/tanks', data);
  },

  async update(data: UpdateTankData): Promise<Tank> {
    const { id, ...updateData } = data;
    return browserHttpClient.put<Tank>(`/api/company/tanks/${id}`, updateData);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/tanks/${id}`);
  },

  async getTankTypes(): Promise<TankType[]> {
    return browserHttpClient.get<TankType[]>('/api/company/tanks/tank-types');
  },
};
