import type {
  Tank,
  CreateTankData,
  UpdateTankData,
  TankListResponse,
  ApiTankTypeListResponse,
  TankTypeListResponse,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const tankService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<TankListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/tanks?${queryString}` : '/api/company/tanks';
    return browserHttpClient.get<TankListResponse>(endpoint);
  },

  async listWithoutBatches(params?: {
    page?: number;
    perPage?: number;
    companyId?: string;
  }): Promise<TankListResponse> {
    const queryString = buildQueryString({
      page: params?.page,
      perPage: params?.perPage,
      companyId: params?.companyId,
    });
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

  async getTankTypes(): Promise<TankTypeListResponse> {
    return browserHttpClient.get<TankTypeListResponse>('/api/company/tanks/tank-types');
  },
};
