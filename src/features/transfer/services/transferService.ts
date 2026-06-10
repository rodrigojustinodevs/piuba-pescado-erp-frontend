import type {
  CreateTransferData,
  PatchTransferPayload,
  Transfer,
  TransferListResponse,
  UpdateTransferData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { HttpError } from '@/shared/lib/http/httpError';

function mapTransfer422(message: string): string {
  if (message.includes('The batch is not in the origin tank')) {
    return 'O lote não está no tanque de origem informado.';
  }
  if (message.includes('Transfer quantity') && message.includes('exceeds available stock')) {
    const match = message.match(/available stock \((\d+)\)/);
    const available = match?.[1] ?? '';
    return `Quantidade informada excede o estoque disponível (${available} disponíveis).`;
  }
  if (message.includes('already has an active batch')) {
    return 'O tanque de destino já possui um lote ativo.';
  }
  if (message.toLowerCase().includes('same tank') || message.includes('TransferSameTankException')) {
    return 'Origem e destino não podem ser o mesmo tanque.';
  }
  return message;
}

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

  async update(data: UpdateTransferData | PatchTransferPayload): Promise<Transfer> {
    const { id, ...patch } = data;
    try {
      return await browserHttpClient.put<Transfer>(`/api/company/transfers/${id}`, patch);
    } catch (error) {
      if (error instanceof HttpError && error.status === 422) {
        throw new HttpError(mapTransfer422(error.message), 422);
      }
      throw error;
    }
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
