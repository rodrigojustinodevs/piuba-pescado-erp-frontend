import type { ApiPurchase, Purchase, UpdatePurchaseData } from '@/features/purchase/types';
import { mapApiPurchase } from '@/features/purchase/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Purchases API Proxy';

type ApiPurchaseDetailEnvelope = { response?: ApiPurchase } | ApiPurchase;

function mapDetailResponse(data: ApiPurchaseDetailEnvelope): Purchase {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiPurchase(api as ApiPurchase);
}

export const GET = createDetailGetHandler<ApiPurchaseDetailEnvelope, Purchase, { id: string }>({
  backendPathBuilder: (params) => `/api/company/purchase/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiPurchaseDetailEnvelope, UpdatePurchaseData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/purchase/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { ...rest } = payload;
    return rest;
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/purchase/${params.id}`,
  context: CONTEXT,
});
