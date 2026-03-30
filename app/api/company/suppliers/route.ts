import type { ApiSupplierListResponse, SupplierListResponse } from '@/features/supplier/types';
import { mapApiSupplierList } from '@/features/supplier/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Suppliers API Proxy';

export const GET = createListGetHandler<ApiSupplierListResponse, SupplierListResponse>({
  backendPath: '/api/company/suppliers',
  mapResponse: mapApiSupplierList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['company_id'],
    }),
});
