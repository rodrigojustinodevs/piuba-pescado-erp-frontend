import type { Feeding, FeedingListResponse, CreateFeedingData, UpdateFeedingData } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const feedingService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<FeedingListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/feedings?${queryString}` : '/api/company/feedings';
    return browserHttpClient.get<FeedingListResponse>(endpoint);
  },

  async create(data: CreateFeedingData): Promise<Feeding> {
    return browserHttpClient.post<Feeding>('/api/company/feedings', data);
  },

  async getById(id: string): Promise<Feeding> {
    return browserHttpClient.get<Feeding>(`/api/company/feedings/${id}`);
  },

  async update(data: UpdateFeedingData): Promise<Feeding> {
    const { id, ...body } = data;
    return browserHttpClient.put<Feeding>(`/api/company/feedings/${id}`, body);
  },
};
