import axios from 'axios';
import type {
  CreateTransferData,
  Transfer,
  TransferListResponse,
  UpdateTransferData,
} from '../types';

const transferListApi = axios.create({
  baseURL: '/api/company/transfers',
  headers: { 'Content-Type': 'application/json' },
});

export const transferService = {
  async list(params?: { page?: number; per_page?: number }): Promise<TransferListResponse> {
    const response = await transferListApi.get<TransferListResponse>('/', { params });
    return response.data;
  },

  async getById(id: string): Promise<Transfer> {
    const response = await transferListApi.get<Transfer>(`/${id}`);
    return response.data;
  },

  async create(data: CreateTransferData): Promise<Transfer> {
    const response = await transferListApi.post<Transfer>('/', data);
    return response.data;
  },

  async update(data: UpdateTransferData): Promise<Transfer> {
    const { id, ...body } = data;
    const response = await transferListApi.put<Transfer>(`/${id}`, body);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    try {
      await transferListApi.delete(`/${id}`);
    } catch (error) {
      if (!axios.isAxiosError(error) || !error.response) {
        throw error;
      }

      const data = error.response.data as
        | { error?: string; message?: string }
        | string
        | null
        | undefined;

      const rawMessage =
        typeof data === 'string' ? data : (data?.error ?? data?.message ?? undefined);

      if (rawMessage?.includes('origin tank already has an active batch')) {
        throw new Error(
          'Não é possível excluir a transferência: o tanque de origem já possui um lote ativo. Um tanque só pode ter um lote ativo.',
        );
      }

      if (rawMessage) {
        throw new Error(rawMessage);
      }

      throw new Error('Erro ao excluir transferência. Tente novamente.');
    }
  },
};
