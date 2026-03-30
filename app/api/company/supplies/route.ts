import type { ApiNamedListResponse, SupplyListResponse } from '@/features/purchase/types';
import { mapSupplyListResponse } from '@/features/purchase/utils/mapNamedListResponse';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Supplies API Proxy';

export const GET = createListGetHandler<ApiNamedListResponse, SupplyListResponse>({
  backendPath: '/api/company/supplies',
  mapResponse: mapSupplyListResponse,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['company_id'],
    }),
});
