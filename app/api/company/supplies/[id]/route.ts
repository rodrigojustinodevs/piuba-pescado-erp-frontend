import type { ApiSupply, Supply, UpdateSupplyData } from '@/features/supply/types';
import { buildSupplyBody, mapApiSupply } from '@/features/supply/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Supplies API Proxy';

type ApiSupplyDetailEnvelope = { response?: ApiSupply } | ApiSupply;

function mapDetailResponse(data: ApiSupplyDetailEnvelope): Supply {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiSupply(api as ApiSupply);
}

export const GET = createDetailGetHandler<ApiSupplyDetailEnvelope, Supply, { id: string }>({
  backendPathBuilder: (params) => `/api/company/supply/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/supply/${params.id}`,
  context: CONTEXT,
});

export const PUT = createPutHandler<ApiSupplyDetailEnvelope, UpdateSupplyData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/supply/${params.id}`,
  context: CONTEXT,
  mapBody: buildSupplyBody,
  mapResponse: mapDetailResponse,
});

