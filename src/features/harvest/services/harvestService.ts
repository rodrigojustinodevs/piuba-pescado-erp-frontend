import type {
  CreateHarvestData,
  Harvest,
  HarvestListResponse,
  PatchHarvestPayload,
  UpdateHarvestData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { HttpError } from '@/shared/lib/http/httpError';

export const harvestService = {
  async list(params?: { page?: number; per_page?: number }): Promise<HarvestListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', String(params.page));
    if (params?.per_page !== undefined) searchParams.set('per_page', String(params.per_page));
    const qs = searchParams.toString();
    return browserHttpClient.get<HarvestListResponse>(
      qs ? `/api/company/harvests?${qs}` : '/api/company/harvests',
    );
  },

  async getById(id: string): Promise<Harvest> {
    return browserHttpClient.get<Harvest>(`/api/company/harvests/${id}`);
  },

  async create(data: CreateHarvestData): Promise<Harvest> {
    const { companyId: _, ...payload } = data;
    return browserHttpClient.post<Harvest>('/api/company/harvests', payload);
  },

  async update(data: UpdateHarvestData | PatchHarvestPayload): Promise<Harvest> {
    const { id, ...patch } = data;
    try {
      return await browserHttpClient.put<Harvest>(`/api/company/harvests/${id}`, patch);
    } catch (error) {
      if (error instanceof HttpError && error.status === 422) {
        throw new HttpError(error.message, 422);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/harvests/${id}`);
  },
};
