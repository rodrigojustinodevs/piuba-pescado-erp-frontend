import type {
  CreatePurchaseData,
  Purchase,
  PurchaseListResponse,
  UpdatePurchaseData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const purchaseService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PurchaseListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/purchases?${queryString}`
      : '/api/company/purchases';
    return browserHttpClient.get<PurchaseListResponse>(endpoint);
  },

  async create(data: CreatePurchaseData): Promise<Purchase> {
    return browserHttpClient.post<Purchase>('/api/company/purchases', data);
  },

  async getById(id: string): Promise<Purchase> {
    return browserHttpClient.get<Purchase>(`/api/company/purchases/${id}`);
  },

  async update(data: UpdatePurchaseData): Promise<Purchase> {
    const { id, ...body } = data;
    return browserHttpClient.put<Purchase>(`/api/company/purchases/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<void>(`/api/company/purchases/${id}`);
  },

  async receive(id: string): Promise<Purchase> {
    return browserHttpClient.patch<Purchase>(`/api/company/purchases/${id}/receive`);
  },

  async cancel(id: string): Promise<Purchase> {
    return browserHttpClient.patch<Purchase>(`/api/company/purchases/${id}/cancel`);
  },
};
