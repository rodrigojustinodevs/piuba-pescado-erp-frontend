import type { ApiSupply, CreateSupplyData } from '@/features/supply/types';
import { buildSupplyBody, mapApiSupply } from '@/features/supply/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Supply API Proxy';

type ApiSupplyCreateResponse = { response?: ApiSupply } | ApiSupply;

export const POST = createUpsertHandler<ApiSupplyCreateResponse, CreateSupplyData>({
  backendPath: '/api/company/supply',
  method: 'POST',
  context: CONTEXT,
  mapBody: (payload) => ({ ...buildSupplyBody(payload), status: 'active' }),
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiSupply(api as ApiSupply);
  },
});

