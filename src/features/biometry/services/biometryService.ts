import type {
  Biometry,
  BiometryListResponse,
  CreateBiometryData,
  UpdateBiometryData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const biometryService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BiometryListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/biometries?${queryString}`
      : '/api/company/biometries';
    return browserHttpClient.get<BiometryListResponse>(endpoint);
  },

  async create(data: CreateBiometryData): Promise<Biometry> {
    return browserHttpClient.post<Biometry>('/api/company/biometries', data);
  },

  async getById(id: string): Promise<Biometry> {
    return browserHttpClient.get<Biometry>(`/api/company/biometries/${id}`);
  },

  async update(data: UpdateBiometryData): Promise<Biometry> {
    const { id, ...body } = data;
    return browserHttpClient.put<Biometry>(`/api/company/biometries/${id}`, body);
  },
};
