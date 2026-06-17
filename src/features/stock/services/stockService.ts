import type {
  CreateMovementData,
  CreateStockLocationData,
  StockListResponse,
  StockLocation,
  UpdateStockLocationData,
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

  async create(data: CreateStockLocationData): Promise<StockLocation> {
    return browserHttpClient.post<StockLocation>('/api/company/stock', data);
  },

  async getById(id: string): Promise<StockLocation> {
    return browserHttpClient.get<StockLocation>(`/api/company/stocks/${id}`);
  },

  async update(data: UpdateStockLocationData): Promise<StockLocation> {
    const { id, ...body } = data;
    return browserHttpClient.put<StockLocation>(`/api/company/stocks/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/stocks/${id}`);
  },

  async registerMovement(data: CreateMovementData): Promise<void> {
    const { stockId, ...body } = data;
    await browserHttpClient.post<null>(`/api/company/stocks/${stockId}/movements`, body);
  },
};
