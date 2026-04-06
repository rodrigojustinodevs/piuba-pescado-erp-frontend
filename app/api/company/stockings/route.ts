import type {
  ApiStockingListResponse,
  StockingListResponse,
  Stocking,
  CreateStockingData,
} from '@/features/stocking';
import { mapApiStockingList } from '@/features/stocking/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Stockings API Proxy';

export const GET = createListGetHandler<ApiStockingListResponse, StockingListResponse>({
  backendPath: '/api/company/stockings',
  mapResponse: mapApiStockingList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      pageParam: 'page',
      limitParam: 'perPage',
      passthrough: ['batchId'],
    }),
});

export const POST = createUpsertHandler<Stocking, CreateStockingData>({
  backendPath: '/api/company/stockings',
  method: 'POST',
  context: CONTEXT,
});
