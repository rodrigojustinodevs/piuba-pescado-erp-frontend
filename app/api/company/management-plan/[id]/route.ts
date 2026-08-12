import type { ApiManagementPlanResponse, ManagementPlan } from '@/features/managementPlan';
import { mapApiManagementPlan } from '@/features/managementPlan/utils/apiMapper';
import { createDetailGetHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Management Plan Detail API Proxy';

type RouteParams = { id: string };

export const GET = createDetailGetHandler<ApiManagementPlanResponse, ManagementPlan, RouteParams>({
  backendPathBuilder: (params) => `/api/company/management-plan/${params.id}`,
  context: CONTEXT,
  mapResponse: (data): ManagementPlan => mapApiManagementPlan(data.response),
});
