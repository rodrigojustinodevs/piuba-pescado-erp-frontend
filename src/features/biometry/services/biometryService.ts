import type {
  Biometry,
  BiometryListResponse,
  CreateBiometryData,
  UpdateBiometryData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';

type QueryValue = string | number | boolean | null | undefined;

function buildQueryString(
  params: Record<string, QueryValue>,
  options?: { skipEmptyString?: boolean },
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const stringValue = String(value);
    if (options?.skipEmptyString && stringValue === '') continue;
    searchParams.set(key, stringValue);
  }
  return searchParams.toString();
}

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
