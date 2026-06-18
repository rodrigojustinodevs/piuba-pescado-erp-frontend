import type {
  ApiFinancialTransactionListResponse,
  FinancialTransactionListResponse,
} from '@/features/financialTransaction';
import { mapApiFinancialTransactionList } from '@/features/financialTransaction/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Financial transactions API Proxy';

export const GET = createListGetHandler<
  ApiFinancialTransactionListResponse,
  FinancialTransactionListResponse
>({
  backendPath: '/api/company/financial-transactions',
  mapResponse: mapApiFinancialTransactionList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'per_page',
      passthrough: ['search', 'type', 'status'],
    }),
});
