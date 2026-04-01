import type { ApiSupplyListResponse, SupplyListResponse } from '@/features/supply/types';
import { mapApiSupplyList } from '@/features/supply/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Supplies API Proxy';

export const GET = createListGetHandler<ApiSupplyListResponse, SupplyListResponse>({
  backendPath: '/api/company/supplies',
  mapResponse: mapApiSupplyList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['company_id'],
    }),
});
