import type { CreateSupplyData, Supply, SupplyListResponse, UpdateSupplyData } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const supplyService = {
  async list(params?: { page?: number; limit?: number; search?: string }): Promise<SupplyListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/supplies?${queryString}` : '/api/company/supplies';
    return browserHttpClient.get<SupplyListResponse>(endpoint);
  },

  async create(data: CreateSupplyData): Promise<Supply> {
    return browserHttpClient.post<Supply>('/api/company/supply', data);
  },

  async getById(id: string): Promise<Supply> {
    return browserHttpClient.get<Supply>(`/api/company/supplies/${id}`);
  },

  async update(data: UpdateSupplyData): Promise<Supply> {
    const { id, ...body } = data;
    return browserHttpClient.put<Supply>(`/api/company/supplies/${id}`, body);
  },
};

