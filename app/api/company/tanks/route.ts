import type {
  ApiTank,
  ApiTankListResponse,
  CreateTankData,
  TankListResponse,
} from '@/features/tank';
import { mapApiTank, mapApiTankList } from '@/features/tank/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Tanks API Proxy';

interface ApiTankResponse {
  response: ApiTank;
}

export const GET = createListGetHandler<ApiTankListResponse, TankListResponse>({
  backendPath: '/api/company/tanks',
  mapResponse: mapApiTankList,
  context: CONTEXT,
  buildQueryString: buildPaginationQueryString,
});

export const POST = createUpsertHandler<ApiTankResponse, CreateTankData>({
  backendPath: '/api/company/tank',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data) => mapApiTank(data.response),
});
