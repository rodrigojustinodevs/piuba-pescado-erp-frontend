import type {
  ApiBatchListResponse,
  Batch,
  BatchListResponse,
  CreateBatchData,
} from '@/features/batch';
import { mapApiBatchList } from '@/features/batch/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Batches API Proxy';

export const GET = createListGetHandler<ApiBatchListResponse, BatchListResponse>({
  backendPath: '/api/company/batches',
  mapResponse: mapApiBatchList,
  context: CONTEXT,
  buildQueryString: buildPaginationQueryString,
});

export const POST = createUpsertHandler<Batch, CreateBatchData>({
  backendPath: '/api/company/batche',
  method: 'POST',
  context: CONTEXT,
});
