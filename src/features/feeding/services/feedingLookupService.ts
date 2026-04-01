import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';
import { StockListResponse } from '../../stock/types';

const LOOKUP_LIMIT = 500;

export const feedingLookupService = {
  async listStocks(companyId?: string | null): Promise<StockListResponse> {
    const qs = buildQueryString(
      {
        page: 1,
        per_page: LOOKUP_LIMIT,
        ...(companyId?.trim() ? { company_id: companyId.trim() } : {}),
      },
      { skipEmptyString: true },
    );
    return browserHttpClient.get<StockListResponse>(`/api/company/stocks?${qs}`);
  },
};
