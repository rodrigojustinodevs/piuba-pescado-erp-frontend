import type {
  StockingListResponse,
  Stocking,
  CreateStockingData,
  UpdateStockingData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';

export const stockingService = {
  async list(params?: {
    page?: number;
    perPage?: number;
    batchId?: string;
  }): Promise<StockingListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params?.perPage !== undefined) {
      searchParams.set('perPage', String(params.perPage));
    }
    const batchId = params?.batchId?.trim();
    if (batchId) {
      searchParams.set('batchId', batchId);
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
