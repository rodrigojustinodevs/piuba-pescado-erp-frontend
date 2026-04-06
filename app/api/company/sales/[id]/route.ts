import type { ApiSale, Sale, UpdateSaleData } from '@/features/sale/types';
import { mapApiSale } from '@/features/sale/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Sale detail API Proxy';

type ApiSaleDetailEnvelope = { response?: ApiSale } | ApiSale;

function mapDetailResponse(data: ApiSaleDetailEnvelope): Sale {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiSale(api as ApiSale);
}

export const GET = createDetailGetHandler<ApiSaleDetailEnvelope, Sale, { id: string }>({
  backendPathBuilder: (params) => `/api/company/sale/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiSaleDetailEnvelope, UpdateSaleData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/sale/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { ...rest } = payload;
    return {
      total_weight: rest.totalWeight,
      price_per_kg: rest.pricePerKg,
      sale_date: rest.saleDate,
      status: rest.status,
      notes: rest.notes?.trim() ? rest.notes.trim() : null,
      is_total_harvest: rest.isTotalHarvest,
    };
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/sale/${params.id}`,
  context: CONTEXT,
});
