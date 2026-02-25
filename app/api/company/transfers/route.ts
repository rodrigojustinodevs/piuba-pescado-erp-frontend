import type {
  ApiTransferListResponse,
  CreateTransferData,
  Transfer,
  TransferListResponse,
} from '@/features/transfer';
import { mapApiTransferList } from '@/features/transfer';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Transfers API Proxy';

export const GET = createListGetHandler<
  ApiTransferListResponse,
  TransferListResponse
>({
  backendPath: '/api/company/transfers',
  mapResponse: mapApiTransferList,
  context: CONTEXT,
  buildQueryString: buildPaginationQueryString,
});

export const POST = createUpsertHandler<Transfer, CreateTransferData>({
  backendPath: '/api/company/transfer',
  method: 'POST',
  context: CONTEXT,
});
