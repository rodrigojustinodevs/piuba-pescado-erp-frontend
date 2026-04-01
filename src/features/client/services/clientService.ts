import type { Client, ClientListResponse, CreateClientData, UpdateClientData } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const clientService = {
  async list(params?: { page?: number; limit?: number; search?: string }): Promise<ClientListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/clients?${queryString}` : '/api/company/clients';
    return browserHttpClient.get<ClientListResponse>(endpoint);
  },

  async create(data: CreateClientData): Promise<Client> {
    return browserHttpClient.post<Client>('/api/company/client', data);
  },

  async getById(id: string): Promise<Client> {
    return browserHttpClient.get<Client>(`/api/company/clients/${id}`);
  },

  async update(data: UpdateClientData): Promise<Client> {
    const { id, ...body } = data;
    return browserHttpClient.put<Client>(`/api/company/clients/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/clients/${id}`);
  },
};

