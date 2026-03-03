import type {
  StockingListResponse,
  Stocking,
  CreateStockingData,
  UpdateStockingData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';

export const stockingService = {
  async list(params?: { page?: number; per_page?: number }): Promise<StockingListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params?.per_page !== undefined) {
      searchParams.set('per_page', String(params.per_page));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/company/stockings?${queryString}`
      : '/api/company/stockings';
    return browserHttpClient.get<StockingListResponse>(endpoint);
  },

  async getById(id: string): Promise<Stocking> {
    return browserHttpClient.get<Stocking>(`/api/company/stockings/${id}`);
  },

  async create(data: CreateStockingData): Promise<Stocking> {
    return browserHttpClient.post<Stocking>('/api/company/stockings', data);
  },

  async update(data: UpdateStockingData): Promise<Stocking> {
    const { id, ...updateData } = data;
    return browserHttpClient.put<Stocking>(`/api/company/stockings/${id}`, updateData);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/stockings/${id}`);
  },
};
