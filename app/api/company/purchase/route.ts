import type { ApiPurchase, CreatePurchaseData } from '@/features/purchase/types';
import { mapApiPurchase } from '@/features/purchase/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Purchase API Proxy';

type ApiPurchaseCreateResponse = { response?: ApiPurchase } | ApiPurchase;

export const POST = createUpsertHandler<ApiPurchaseCreateResponse, CreatePurchaseData>({
  backendPath: '/api/company/purchase',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiPurchase(api as ApiPurchase);
  },
});
