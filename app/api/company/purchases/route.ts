import type {
  ApiPurchase,
  ApiPurchaseListResponse,
  CreatePurchaseData,
  PurchaseListResponse,
} from '@/features/purchase/types';
import { mapApiPurchase, mapApiPurchaseList } from '@/features/purchase/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Purchases API Proxy';

export const GET = createListGetHandler<ApiPurchaseListResponse, PurchaseListResponse>({
  backendPath: '/api/company/purchases',
  mapResponse: mapApiPurchaseList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});

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
