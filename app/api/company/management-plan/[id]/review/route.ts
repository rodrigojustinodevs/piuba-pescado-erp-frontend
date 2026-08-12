import type {
  ApiManagementPlanResponse,
  ManagementPlan,
  ReviewDecision,
} from '@/features/managementPlan';
import { mapApiManagementPlan } from '@/features/managementPlan/utils/apiMapper';
import { serverHttpClient } from '@/shared/lib/http';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { successResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';

const CONTEXT = 'Management Plan Review API Proxy';

type RouteParams = { params: Promise<{ id: string }> };

interface ReviewBody {
  decision: ReviewDecision;
  rejectionReason?: string;
}

const handler = withErrorHandling(async function POST(req: Request, routeContext: RouteParams) {
  const { id } = await routeContext.params;
  const body = (await req.json()) as ReviewBody;

  const data = await serverHttpClient.request<ApiManagementPlanResponse>(
    `/api/company/management-plan/${id}/review`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );

  const managementPlan: ManagementPlan = mapApiManagementPlan(data.response);
  return successResponse(managementPlan, 200);
}, CONTEXT);

export const POST = withAuthGuard(async (_auth, req: Request, routeContext: RouteParams) =>
  handler(req, routeContext),
);
