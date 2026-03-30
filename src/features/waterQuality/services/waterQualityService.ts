import type {
  CreateWaterQualityData,
  UpdateWaterQualityData,
  WaterQuality,
  WaterQualityListResponse,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const waterQualityService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<WaterQualityListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/water-qualities?${queryString}`
      : '/api/company/water-qualities';
    return browserHttpClient.get<WaterQualityListResponse>(endpoint);
  },

  async create(data: CreateWaterQualityData): Promise<WaterQuality> {
    return browserHttpClient.post<WaterQuality>('/api/company/water-qualities', data);
  },

  async getById(id: string): Promise<WaterQuality> {
    return browserHttpClient.get<WaterQuality>(`/api/company/water-qualities/${id}`);
  },

  async update(data: UpdateWaterQualityData): Promise<WaterQuality> {
    const { id, ...body } = data;
    return browserHttpClient.put<WaterQuality>(`/api/company/water-qualities/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<void>(`/api/company/water-qualities/${id}`);
  },
};
