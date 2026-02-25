import type {
  ApiSettlementListResponse,
  SettlementListResponse,
  Settlement,
  CreateSettlementData,
} from '@/features/settlement';
import { mapApiSettlementList } from '@/features/settlement/utils/apiMapper';
import { createListGetHandler, createCreatePostHandler } from '../../_utils/proxyListRoute';
import { buildPageLimitSearchQueryString } from '../../_utils/pagination';

const CONTEXT = 'Settlements API Proxy';

export const GET = createListGetHandler<ApiSettlementListResponse, SettlementListResponse>({
  backendPath: '/api/company/settlements',
  errorFallback: 'Falha na comunicação com o serviço de povoamentos',
  mapResponse: mapApiSettlementList,
  context: CONTEXT,
  buildQueryString: buildPageLimitSearchQueryString,
});

export const POST = createCreatePostHandler<Settlement, CreateSettlementData>({
  backendPath: '/api/company/settlement',
  errorFallback: 'Erro ao criar povoamento',
  context: CONTEXT,
});
