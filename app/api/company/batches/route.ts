import type {
  ApiBatchListResponse,
  Batch,
  BatchListResponse,
  CreateBatchData,
} from '@/features/batch';
import { mapApiBatchList } from '@/features/batch/utils/apiMapper';
import { createListGetHandler, createCreatePostHandler } from '../../_utils/proxyListRoute';
import { buildPageLimitSearchQueryString } from '../../_utils/pagination';

const CONTEXT = 'Batches API Proxy';

export const GET = createListGetHandler<ApiBatchListResponse, BatchListResponse>({
  backendPath: '/api/company/batches',
  errorFallback: 'Erro ao listar lotes',
  mapResponse: mapApiBatchList,
  context: CONTEXT,
  buildQueryString: buildPageLimitSearchQueryString,
});

/** Backend usa /api/company/batche (singular) para criação. */
export const POST = createCreatePostHandler<Batch, CreateBatchData>({
  backendPath: '/api/company/batche',
  errorFallback: 'Erro ao criar lote',
  context: CONTEXT,
});
