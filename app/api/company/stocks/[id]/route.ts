import type { ApiStock, Stock, UpdateStockData } from '@/features/stock/types';
import { mapApiStock } from '@/features/stock/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Stocks API Proxy';

type ApiStockDetailEnvelope = { response?: ApiStock } | ApiStock;

function mapDetailResponse(data: ApiStockDetailEnvelope): Stock {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiStock(api as ApiStock);
}

function mapUpdateBody(payload: UpdateStockData) {
  const { id, unit, supplierId, unitPrice, minimumStock, withdrawalQuantity } = payload;
  void id;
  return {
    unit,
    unitPrice,
    minimumStock,
    withdrawalQuantity,
    supplierId: supplierId === '' || supplierId == null ? null : supplierId,
  };
}

export const GET = createDetailGetHandler<ApiStockDetailEnvelope, Stock, { id: string }>({
  backendPathBuilder: (params) => `/api/company/stock/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiStockDetailEnvelope, UpdateStockData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/stock/${params.id}`,
  context: CONTEXT,
  mapBody: mapUpdateBody,
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/stock/${params.id}`,
  context: CONTEXT,
});
