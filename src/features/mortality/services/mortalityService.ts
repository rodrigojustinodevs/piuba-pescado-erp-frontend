import type {
  CreateMortalityData,
  Mortality,
  MortalityListResponse,
  UpdateMortalityData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const mortalityService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<MortalityListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/mortalities?${queryString}` : '/api/company/mortalities';
    return browserHttpClient.get<MortalityListResponse>(endpoint);
  },

  async create(data: CreateMortalityData): Promise<Mortality> {
    return browserHttpClient.post<Mortality>('/api/company/mortalities', data);
  },

  async getById(id: string): Promise<Mortality> {
    return browserHttpClient.get<Mortality>(`/api/company/mortalities/${id}`);
  },

  async update(data: UpdateMortalityData): Promise<Mortality> {
    const { id, ...body } = data;
    return browserHttpClient.put<Mortality>(`/api/company/mortalities/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<void>(`/api/company/mortalities/${id}`);
  },
};
