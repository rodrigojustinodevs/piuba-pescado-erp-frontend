import type { UpdateUserRoleData, User } from '@/features/user/types';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { successResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { serverHttpClient } from '@/shared/lib/http';

interface ApiUserResponse {
  status: boolean;
  response: User;
  message: string;
}

const CONTEXT = 'User Role API Proxy';

type ParamsContext = {
  params: Promise<{ id: string }>;
};

const handler = withErrorHandling(async function PATCH(req: Request, routeContext: ParamsContext) {
  const params = await routeContext.params;
  const { role, companyId } = (await req.json()) as Pick<
    UpdateUserRoleData,
    'role' | 'companyId'
  >;
  const data = await serverHttpClient.request<ApiUserResponse>(
    `/api/company/user/${params.id}/role`,
    {
      method: 'PATCH',
      body: JSON.stringify({ role, companyId }),
    },
  );

  return successResponse(data.response, 200);
}, CONTEXT);

export const PATCH = withAuthGuard(async (_auth, req: Request, routeContext: ParamsContext) =>
  handler(req, routeContext),
);
