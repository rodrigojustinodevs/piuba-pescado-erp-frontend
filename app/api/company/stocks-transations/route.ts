import type {
  ApiStockTransactionListResponse,
  StockTransactionListResponse,
} from '@/features/stockTransaction/types';
import { mapApiStockTransactionList } from '@/features/stockTransaction/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Stock transactions API Proxy';

export const GET = createListGetHandler<
  ApiStockTransactionListResponse,
  StockTransactionListResponse
>({
  backendPath: '/api/company/stock-transactions',
  mapResponse: mapApiStockTransactionList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['reference_type', 'reference_id'],
    }),
});
