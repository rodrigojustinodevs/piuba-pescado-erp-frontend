import type { Company, CreateCompanyData, UpdateCompanyData, CompanyListResponse } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';

export const companyService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CompanyListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params?.limit !== undefined) {
      searchParams.set('limit', String(params.limit));
    }
    if (params?.search !== undefined && params.search !== '') {
      searchParams.set('search', params.search);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/companies?${queryString}` : '/api/companies';
    return browserHttpClient.get<CompanyListResponse>(endpoint);
  },

  async getById(id: string): Promise<Company> {
    return browserHttpClient.get<Company>(`/api/companies/${id}`);
  },

  async create(data: CreateCompanyData): Promise<Company> {
    return browserHttpClient.post<Company>('/api/companies', data);
  },

  async update(data: UpdateCompanyData): Promise<Company> {
    const { id, ...updateData } = data;
    return browserHttpClient.put<Company>(`/api/companies/${id}`, updateData);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/companies/${id}`);
  },
};
