import type {
  ApiBatchListResponse,
  Batch,
  BatchListResponse,
  CreateBatchData,
} from '@/features/batch';
import { mapApiBatchList } from '@/features/batch/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Batches API Proxy';

export const GET = createListGetHandler<ApiBatchListResponse, BatchListResponse>({
  backendPath: '/api/company/batches',
  mapResponse: mapApiBatchList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, { passthrough: ['companyId'] }),
});

export const POST = createUpsertHandler<Batch, CreateBatchData>({
  backendPath: '/api/company/batch',
  method: 'POST',
  context: CONTEXT,
});
