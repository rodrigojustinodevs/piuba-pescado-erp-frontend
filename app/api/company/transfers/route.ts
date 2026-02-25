import type {
  ApiTransferListResponse,
  CreateTransferData,
  Transfer,
  TransferListResponse,
} from '@/features/transfer';
import { mapApiTransferList } from '@/features/transfer';
import {
  createListGetHandler,
  createCreatePostHandler,
} from '../../_utils/proxyListRoute';
import { buildPageLimitSearchQueryString } from '../../_utils/pagination';

const CONTEXT = 'Transfers API Proxy';

export const GET = createListGetHandler<
  ApiTransferListResponse,
  TransferListResponse
>({
  backendPath: '/api/company/transfers',
  errorFallback: 'Falha na comunicação com o serviço de transferências',
  mapResponse: mapApiTransferList,
  context: CONTEXT,
  buildQueryString: buildPageLimitSearchQueryString,
});

export const POST = createCreatePostHandler<Transfer, CreateTransferData>({
  backendPath: '/api/company/transfer',
  errorFallback: 'Erro ao criar transferência',
  context: CONTEXT,
});
