import type { FinancialTransactionListResponse } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const financialTransactionService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<FinancialTransactionListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/financial-transactions?${queryString}`
      : '/api/company/financial-transactions';
    return browserHttpClient.get<FinancialTransactionListResponse>(endpoint);
  },
};

