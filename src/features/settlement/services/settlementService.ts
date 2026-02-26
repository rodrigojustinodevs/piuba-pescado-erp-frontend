import type {
  SettlementListResponse,
  Settlement,
  CreateSettlementData,
  UpdateSettlementData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';

export const settlementService = {
  async list(params?: { page?: number; per_page?: number }): Promise<SettlementListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params?.per_page !== undefined) {
      searchParams.set('per_page', String(params.per_page));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/company/settlements?${queryString}`
      : '/api/company/settlements';
    return browserHttpClient.get<SettlementListResponse>(endpoint);
  },

  async getById(id: string): Promise<Settlement> {
    return browserHttpClient.get<Settlement>(`/api/company/settlements/${id}`);
  },

  async create(data: CreateSettlementData): Promise<Settlement> {
    return browserHttpClient.post<Settlement>('/api/company/settlements', data);
  },

  async update(data: UpdateSettlementData): Promise<Settlement> {
    const { id, ...updateData } = data;
    return browserHttpClient.put<Settlement>(`/api/company/settlements/${id}`, updateData);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/settlements/${id}`);
  },
};
