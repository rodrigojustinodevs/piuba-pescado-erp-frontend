import type { CreateSaleData, Sale, SaleListResponse, UpdateSaleData } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const saleService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    clientId?: string;
    batchId?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
    dateFrom?: string;
    dateTo?: string;
  }): Promise<SaleListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
        client_id: params?.clientId,
        batch_id: params?.batchId,
        status: params?.status,
        date_from: params?.dateFrom,
        date_to: params?.dateTo,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/sales?${queryString}` : '/api/company/sales';
    return browserHttpClient.get<SaleListResponse>(endpoint);
  },

  async create(data: CreateSaleData): Promise<Sale> {
    return browserHttpClient.post<Sale>('/api/company/sale', data);
  },

  async getById(id: string): Promise<Sale> {
    return browserHttpClient.get<Sale>(`/api/company/sales/${id}`);
  },

  async update(data: UpdateSaleData): Promise<Sale> {
    const { id, ...body } = data;
    return browserHttpClient.put<Sale>(`/api/company/sales/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/sales/${id}`);
  },

  async cancel(id: string): Promise<Sale> {
    return browserHttpClient.delete<Sale>(`/api/company/sales/${id}/cancel`);
  },
};

