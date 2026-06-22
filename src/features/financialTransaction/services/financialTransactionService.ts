import type {
  CreateFinancialTransactionData,
  FinancialTransaction,
  FinancialTransactionListResponse,
  UpdateFinancialTransactionData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const financialTransactionService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  }): Promise<FinancialTransactionListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
        type: params?.type,
        status: params?.status,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/financial-transactions?${queryString}`
      : '/api/company/financial-transactions';
    return browserHttpClient.get<FinancialTransactionListResponse>(endpoint);
  },

  async create(data: CreateFinancialTransactionData): Promise<FinancialTransaction> {
    return browserHttpClient.post<FinancialTransaction>(
      '/api/company/financial-transaction',
      data,
    );
  },

  async update(data: UpdateFinancialTransactionData): Promise<FinancialTransaction> {
    const { id, ...rest } = data;
    return browserHttpClient.put<FinancialTransaction>(
      `/api/company/financial-transactions/${id}`,
      rest,
    );
  },

  async delete(id: string): Promise<void> {
    return browserHttpClient.delete(`/api/company/financial-transactions/${id}`);
  },
};
