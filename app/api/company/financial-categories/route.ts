import type {
  ApiFinancialCategoryListResponse,
  FinancialCategoryListResponse,
} from '@/features/financialCategory';
import { mapApiFinancialCategoryList } from '@/features/financialCategory/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Financial Categories API Proxy';

export const GET = createListGetHandler<ApiFinancialCategoryListResponse, FinancialCategoryListResponse>({
  backendPath: '/api/company/financial-categories',
  mapResponse: mapApiFinancialCategoryList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['company_id', 'type', 'status'],
    }),
});
