import type { ApiStockLocation, CreateStockLocationData } from '@/features/stock/types';
import { mapApiStockLocation } from '@/features/stock/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Stock API Proxy';

type ApiStockCreateResponse = { response?: ApiStockLocation } | ApiStockLocation;

export const POST = createUpsertHandler<ApiStockCreateResponse, CreateStockLocationData>({
  backendPath: '/api/company/stock',
  method: 'POST',
  context: CONTEXT,
  mapBody: (payload) => {
    const { companyId, ...rest } = payload;
    const body = {
      ...rest,
      responsible: rest.responsible || null,
      notes: rest.notes || null,
    };
    if (companyId?.trim()) return { companyId, ...body };
    return body;
  },
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiStockLocation(api as ApiStockLocation);
  },
});
