import type { ApiSupply, Supply, UpdateSupplyData } from '@/features/supply/types';
import { mapApiSupply } from '@/features/supply/utils/apiMapper';
import {
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

export const PUT = createPutHandler<ApiSupplyDetailEnvelope, UpdateSupplyData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/supply/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { id, ...rest } = payload;
    void id;
    const category = rest.category?.trim() ? rest.category.trim() : null;
    const body = {
      ...rest,
      name: rest.name.trim(),
      category,
      defaultUnit: rest.defaultUnit.trim(),
    };
    if (body.companyId?.trim()) return body;
    const { companyId, ...withoutCompanyId } = body;
    void companyId;
    return withoutCompanyId;
  },
  mapResponse: mapDetailResponse,
});

