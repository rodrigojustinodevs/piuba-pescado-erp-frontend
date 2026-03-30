import type { ApiNamedListResponse, SupplierListResponse } from '@/features/purchase/types';
import { mapSupplierListResponse } from '@/features/purchase/utils/mapNamedListResponse';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Suppliers API Proxy';

export const GET = createListGetHandler<ApiNamedListResponse, SupplierListResponse>({
  backendPath: '/api/company/suppliers',
  mapResponse: mapSupplierListResponse,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['company_id'],
    }),
});
