import type {
  ApiManagementPlanListResponse,
  ManagementPlanListResponse,
} from '@/features/managementPlan';
import { mapApiManagementPlanList } from '@/features/managementPlan/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Management Plans API Proxy';

export const GET = createListGetHandler<ApiManagementPlanListResponse, ManagementPlanListResponse>({
  backendPath: '/api/company/management-plans',
  mapResponse: mapApiManagementPlanList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryStringWithPassthrough(searchParams, {
      limitParam: 'perPage',
      passthrough: ['companyId', 'batchId', 'status'],
    }),
});
