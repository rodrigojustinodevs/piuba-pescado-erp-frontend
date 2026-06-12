import type { ApiSupply, Supply, UpdateSupplyData } from '@/features/supply/types';
import { mapApiSupply } from '@/features/supply/utils/apiMapper';
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
  mapBody: (payload) => {
    const category = payload.category?.trim() ? payload.category.trim() : null;
    const sku = payload.sku?.trim() ? payload.sku.trim() : null;
    const description = payload.description?.trim() ? payload.description.trim() : null;
    const body = {
      name: payload.name.trim(),
      sku,
      category,
      unit: payload.defaultUnit.trim(),
      unit_cost: payload.unitCost,
      sale_price: payload.salePrice,
      current_stock: payload.currentStock,
      min_stock: payload.minStock,
      supplier_id: payload.supplierId?.trim() || undefined,
      is_product: payload.isProduct,
      description,
      ...(payload.companyId?.trim() ? { companyId: payload.companyId.trim() } : {}),
    };
    return body;
  },
  mapResponse: mapDetailResponse,
});

