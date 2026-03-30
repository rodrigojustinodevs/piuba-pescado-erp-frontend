import type {
  CreateSupplierData,
  Supplier,
  SupplierListResponse,
  UpdateSupplierData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const supplierService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SupplierListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/suppliers?${queryString}` : '/api/company/suppliers';
    return browserHttpClient.get<SupplierListResponse>(endpoint);
  },

  async create(data: CreateSupplierData): Promise<Supplier> {
    return browserHttpClient.post<Supplier>('/api/company/supplier', data);
  },

  async getById(id: string): Promise<Supplier> {
    return browserHttpClient.get<Supplier>(`/api/company/suppliers/${id}`);
  },

  async update(data: UpdateSupplierData): Promise<Supplier> {
    const { id, ...body } = data;
    return browserHttpClient.put<Supplier>(`/api/company/suppliers/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<void>(`/api/company/suppliers/${id}`);
  },
};
