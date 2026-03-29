import type { ApiMortality, Mortality, UpdateMortalityData } from '@/features/mortality/types';
import { mapApiMortality } from '@/features/mortality/utils/apiMapper';
import { createDeleteHandler, createDetailGetHandler, createPutHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Mortalities API Proxy';

type ApiMortalityDetailEnvelope = { response?: ApiMortality } | ApiMortality;

function mapDetailResponse(data: ApiMortalityDetailEnvelope): Mortality {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiMortality(api as ApiMortality);
}

export const GET = createDetailGetHandler<ApiMortalityDetailEnvelope, Mortality, { id: string }>({
  backendPathBuilder: (params) => `/api/company/mortality/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiMortalityDetailEnvelope, UpdateMortalityData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/mortality/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { id, ...rest } = payload;
    void id;
    return rest;
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/mortality/${params.id}`,
  context: CONTEXT,
});
