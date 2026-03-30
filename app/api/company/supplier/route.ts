import type { ApiSupplier, CreateSupplierData } from '@/features/supplier/types';
import { mapApiSupplier } from '@/features/supplier/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Supplier API Proxy';

type ApiSupplierCreateResponse = { response?: ApiSupplier } | ApiSupplier;

export const POST = createUpsertHandler<ApiSupplierCreateResponse, CreateSupplierData>({
  backendPath: '/api/company/supplier',
  method: 'POST',
  context: CONTEXT,
  mapBody: (payload) => {
    if (payload.companyId?.trim()) return payload;
    const { companyId, ...rest } = payload;
    void companyId;
    return rest;
  },
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiSupplier(api as ApiSupplier);
  },
});
