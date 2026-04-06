import type { ApiSaleListResponse, SaleListResponse } from '@/features/sale/types';
import { mapApiSaleList } from '@/features/sale/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Sales API Proxy';

export const GET = createListGetHandler<ApiSaleListResponse, SaleListResponse>({
  backendPath: '/api/company/sales',
  mapResponse: mapApiSaleList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['client_id', 'batch_id', 'status', 'date_from', 'date_to'],
    }),
});

