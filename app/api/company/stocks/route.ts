import type { ApiStockListResponse, StockListResponse } from '@/features/stock/types';
import { mapApiStockList } from '@/features/stock/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Stocks API Proxy';

export const GET = createListGetHandler<ApiStockListResponse, StockListResponse>({
  backendPath: '/api/company/stocks',
  mapResponse: mapApiStockList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['company_id'],
    }),
});
