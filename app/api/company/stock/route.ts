import type { ApiStock, CreateStockData } from '@/features/stock/types';
import { mapApiStock } from '@/features/stock/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Stock API Proxy';

type ApiStockCreateResponse = { response?: ApiStock } | ApiStock;

export const POST = createUpsertHandler<ApiStockCreateResponse, CreateStockData>({
  backendPath: '/api/company/stock',
  method: 'POST',
  context: CONTEXT,
  mapBody: (payload) => {
    if (payload.companyId?.trim()) return payload;
    const { companyId, ...rest } = payload;
    void companyId;
    return rest;
  },
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiStock(api as ApiStock);
  },
});
