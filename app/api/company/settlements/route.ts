import type {
  ApiSettlementListResponse,
  SettlementListResponse,
  Settlement,
  CreateSettlementData,
} from '@/features/settlement';
import { mapApiSettlementList } from '@/features/settlement/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Settlements API Proxy';

export const GET = createListGetHandler<ApiSettlementListResponse, SettlementListResponse>({
  backendPath: '/api/company/settlements',
  mapResponse: mapApiSettlementList,
  context: CONTEXT,
  buildQueryString: buildPaginationQueryString,
});

export const POST = createUpsertHandler<Settlement, CreateSettlementData>({
  backendPath: '/api/company/settlement',
  method: 'POST',
  context: CONTEXT,
});
