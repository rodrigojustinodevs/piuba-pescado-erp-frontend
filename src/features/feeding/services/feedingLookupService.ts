import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';
import { StockListResponse } from '../../stock/types';

const LOOKUP_LIMIT = 500;

export const feedingLookupService = {
  async listStocks(companyId?: string | null): Promise<StockListResponse> {
    const qs = buildQueryString(
      {
        page: 1,
        perPage: LOOKUP_LIMIT,
        ...(companyId?.trim() ? { companyId: companyId.trim() } : {}),
      },
      { skipEmptyString: true },
    );
    return browserHttpClient.get<StockListResponse>(`/api/company/stocks?${qs}`);
  },
};
