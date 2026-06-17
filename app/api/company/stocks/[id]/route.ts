import type { ApiStockLocation, StockLocation, UpdateStockLocationData } from '@/features/stock/types';
import { mapApiStockLocation } from '@/features/stock/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Stocks API Proxy';

type ApiStockDetailEnvelope = { response?: ApiStockLocation } | ApiStockLocation;

function mapDetailResponse(data: ApiStockDetailEnvelope): StockLocation {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiStockLocation(api as ApiStockLocation);
}

function mapUpdateBody(payload: UpdateStockLocationData) {
  const { id, companyId, ...rest } = payload;
  void id;
  void companyId;
  return {
    ...rest,
    responsible: rest.responsible || null,
    notes: rest.notes || null,
  };
}

export const GET = createDetailGetHandler<ApiStockDetailEnvelope, StockLocation, { id: string }>({
  backendPathBuilder: (params) => `/api/company/stock/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiStockDetailEnvelope, UpdateStockLocationData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/stock/${params.id}`,
  context: CONTEXT,
  mapBody: mapUpdateBody,
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/stock/${params.id}`,
  context: CONTEXT,
});
