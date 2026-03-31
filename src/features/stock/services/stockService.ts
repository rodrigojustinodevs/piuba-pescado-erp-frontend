import type {
  AdjustStockPayload,
  CreateStockData,
  Stock,
  StockListResponse,
  UpdateStockData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const stockService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<StockListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/stocks?${queryString}` : '/api/company/stocks';
    return browserHttpClient.get<StockListResponse>(endpoint);
  },

  async create(data: CreateStockData): Promise<Stock> {
    return browserHttpClient.post<Stock>('/api/company/stock', data);
  },

  async getById(id: string): Promise<Stock> {
    return browserHttpClient.get<Stock>(`/api/company/stocks/${id}`);
  },

  async update(data: UpdateStockData): Promise<Stock> {
    const { id, ...body } = data;
    return browserHttpClient.put<Stock>(`/api/company/stocks/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/stocks/${id}`);
  },

  async adjust(id: string, payload: AdjustStockPayload): Promise<Stock> {
    return browserHttpClient.patch<Stock>(`/api/company/stocks/${id}/adjust`, payload);
  },
};
