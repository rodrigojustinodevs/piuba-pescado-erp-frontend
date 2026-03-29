import type {
  ApiMortality,
  ApiMortalityListResponse,
  CreateMortalityData,
  MortalityListResponse,
} from '@/features/mortality/types';
import { mapApiMortality, mapApiMortalityList } from '@/features/mortality/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Mortalities API Proxy';

export const GET = createListGetHandler<ApiMortalityListResponse, MortalityListResponse>({
  backendPath: '/api/company/mortalities',
  mapResponse: mapApiMortalityList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});

type ApiMortalityCreateResponse = { response?: ApiMortality } | ApiMortality;

export const POST = createUpsertHandler<ApiMortalityCreateResponse, CreateMortalityData>({
  backendPath: '/api/company/mortality',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiMortality(api as ApiMortality);
  },
});
