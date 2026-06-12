import type { ApiSupply, CreateSupplyData } from '@/features/supply/types';
import { mapApiSupply } from '@/features/supply/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Supply API Proxy';

type ApiSupplyCreateResponse = { response?: ApiSupply } | ApiSupply;

export const POST = createUpsertHandler<ApiSupplyCreateResponse, CreateSupplyData>({
  backendPath: '/api/company/supply',
  method: 'POST',
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
      status: 'active',
      ...(payload.companyId?.trim() ? { companyId: payload.companyId.trim() } : {}),
    };
    return body;
  },
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiSupply(api as ApiSupply);
  },
});

