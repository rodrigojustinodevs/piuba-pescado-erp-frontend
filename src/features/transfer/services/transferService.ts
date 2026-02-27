import type {
  CreateTransferData,
  Transfer,
  TransferListResponse,
  UpdateTransferData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { HttpError } from '@/shared/lib/http/httpError';

export const transferService = {
  async list(params?: { page?: number; per_page?: number }): Promise<TransferListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params?.per_page !== undefined) {
      searchParams.set('per_page', String(params.per_page));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/company/transfers?${queryString}`
      : '/api/company/transfers';
    return browserHttpClient.get<TransferListResponse>(endpoint);
  },

  async getById(id: string): Promise<Transfer> {
    return browserHttpClient.get<Transfer>(`/api/company/transfers/${id}`);
  },

  async create(data: CreateTransferData): Promise<Transfer> {
    return browserHttpClient.post<Transfer>('/api/company/transfers', data);
  },

  async update(data: UpdateTransferData): Promise<Transfer> {
    const { id, ...updateData } = data;
    return browserHttpClient.put<Transfer>(`/api/company/transfers/${id}`, updateData);
  },

  async delete(id: string): Promise<void> {
    try {
      await browserHttpClient.delete<null>(`/api/company/transfers/${id}`);
    } catch (error) {
      const message = error instanceof HttpError ? error.message : undefined;
      if (message?.includes('origin tank already has an active batch')) {
        throw new Error(
          'Não é possível excluir a transferência: o tanque de origem já possui um lote ativo. Um tanque só pode ter um lote ativo.',
        );
      }
      throw error;
    }
  },
};
