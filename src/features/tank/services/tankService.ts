import type { Tank, CreateTankData, UpdateTankData, TankListResponse, TankType } from '../types';
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

export const tankService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<TankListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/tanks?${queryString}` : '/api/company/tanks';
    return browserHttpClient.get<TankListResponse>(endpoint);
  },

  async listWithoutBatches(params?: {
    page?: number;
    per_page?: number;
  }): Promise<TankListResponse> {
    const queryString = buildQueryString({
      page: params?.page,
      per_page: params?.per_page,
    });
    const endpoint = queryString
      ? `/api/company/tanks/without-batches?${queryString}`
      : '/api/company/tanks/without-batches';
    return browserHttpClient.get<TankListResponse>(endpoint);
  },

  async getById(id: string): Promise<Tank> {
    return browserHttpClient.get<Tank>(`/api/company/tanks/${id}`);
  },

  async create(data: CreateTankData): Promise<Tank> {
    return browserHttpClient.post<Tank>('/api/company/tanks', data);
  },

  async update(data: UpdateTankData): Promise<Tank> {
    const { id, ...updateData } = data;
    return browserHttpClient.put<Tank>(`/api/company/tanks/${id}`, updateData);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/tanks/${id}`);
  },

  async getTankTypes(): Promise<TankType[]> {
    return browserHttpClient.get<TankType[]>('/api/company/tanks/tank-types');
  },
};
