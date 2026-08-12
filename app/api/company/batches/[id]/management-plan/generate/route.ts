import type { ApiManagementPlanResponse, ManagementPlan } from '@/features/managementPlan';
import { mapApiManagementPlan } from '@/features/managementPlan/utils/apiMapper';
import { createDetailPostHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Generate Management Plan API Proxy';

type RouteParams = { id: string };

export const POST = createDetailPostHandler<ApiManagementPlanResponse, RouteParams>({
  backendPathBuilder: (params) => `/api/company/batch/${params.id}/management-plan/generate`,
  context: CONTEXT,
  mapResponse: (data): ManagementPlan => mapApiManagementPlan(data.response),
});
