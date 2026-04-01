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
    const body = {
      ...payload,
      category,
      name: payload.name.trim(),
      defaultUnit: payload.defaultUnit.trim(),
    };
    if (body.companyId?.trim()) return body;
    const { companyId, ...rest } = body;
    void companyId;
    return rest;
  },
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiSupply(api as ApiSupply);
  },
});

