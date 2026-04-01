import type { StockTransactionListResponse } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const stockTransactionService = {
  async list(params?: {
    page?: number;
    limit?: number;
    referenceType?: string;
    referenceId?: string;
  }): Promise<StockTransactionListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        reference_type: params?.referenceType,
        reference_id: params?.referenceId,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/stocks-transations?${queryString}`
      : '/api/company/stocks-transations';
    return browserHttpClient.get<StockTransactionListResponse>(endpoint);
  },
};
