import type { ApiPurchaseListResponse, PurchaseListResponse } from '@/features/purchase/types';
import { mapApiPurchaseList } from '@/features/purchase/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Purchases API Proxy';

export const GET = createListGetHandler<ApiPurchaseListResponse, PurchaseListResponse>({
  backendPath: '/api/company/purchases',
  mapResponse: mapApiPurchaseList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});
