import type { CreateSpeciesData, Species, SpeciesListResponse, UpdateSpeciesData } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const speciesService = {
  async list(params?: { page?: number; limit?: number; search?: string }): Promise<SpeciesListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/species-list?${queryString}`
      : '/api/company/species-list';
    return browserHttpClient.get<SpeciesListResponse>(endpoint);
  },

  async getById(id: string): Promise<Species> {
    return browserHttpClient.get<Species>(`/api/company/species/${id}`);
  },

  async create(data: CreateSpeciesData): Promise<Species> {
    return browserHttpClient.post<Species>('/api/company/species', data);
  },

  async update(data: UpdateSpeciesData): Promise<Species> {
    const { id, ...updateData } = data;
    return browserHttpClient.put<Species>(`/api/company/species/${id}`, updateData);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/species/${id}`);
  },
};
