import type {
  ApiTank,
  ApiTankListResponse,
  CreateTankData,
  Tank,
  TankListResponse,
} from '@/features/tank';
import { mapApiTank, mapApiTankList } from '@/features/tank/utils/apiMapper';
import { createListGetHandler, createCreatePostHandler } from '../../_utils/proxyListRoute';
import { buildPageLimitSearchQueryString } from '../../_utils/pagination';

const CONTEXT = 'Tanks API Proxy';

interface ApiTankResponse {
  response: ApiTank;
}

export const GET = createListGetHandler<ApiTankListResponse, TankListResponse>({
  backendPath: '/api/company/tanks',
  errorFallback: 'Erro ao listar tanques',
  mapResponse: mapApiTankList,
  context: CONTEXT,
  buildQueryString: buildPageLimitSearchQueryString,
});

export const POST = createCreatePostHandler<ApiTankResponse, CreateTankData>({
  backendPath: '/api/company/tank',
  errorFallback: 'Erro ao criar tanque',
  context: CONTEXT,
  mapResponse: (data) => mapApiTank(data.response),
});
