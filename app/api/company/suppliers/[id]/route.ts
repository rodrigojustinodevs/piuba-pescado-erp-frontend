import type { ApiSupplier, Supplier, UpdateSupplierData } from '@/features/supplier/types';
import { mapApiSupplier } from '@/features/supplier/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Suppliers API Proxy';

type ApiSupplierDetailEnvelope = { response?: ApiSupplier } | ApiSupplier;

function mapDetailResponse(data: ApiSupplierDetailEnvelope): Supplier {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiSupplier(api as ApiSupplier);
}

export const GET = createDetailGetHandler<ApiSupplierDetailEnvelope, Supplier, { id: string }>({
  backendPathBuilder: (params) => `/api/company/supplier/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiSupplierDetailEnvelope, UpdateSupplierData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/supplier/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { ...rest } = payload;
    if (rest.companyId?.trim()) return rest;
    const { companyId, ...withoutCompanyId } = rest;
    void companyId;
    return withoutCompanyId;
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/supplier/${params.id}`,
  context: CONTEXT,
});
