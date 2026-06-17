import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { successResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { serverHttpClient } from '@/shared/lib/http';

const CONTEXT = 'Stock adjust API Proxy';

type ParamsContext = {
  params: Promise<{ id: string }>;
};

type AdjustStockPayload = {
  physicalQuantity: number;
  reason: string;
};

const handler = withErrorHandling(async function PATCH(req: Request, routeContext: ParamsContext) {
  const params = await routeContext.params;
  const payload = (await req.json()) as AdjustStockPayload;
  await serverHttpClient.request<unknown>(`/api/company/stock/${params.id}/adjust`, {
    method: 'PATCH',
    body: JSON.stringify({
      new_physical_quantity: payload.physicalQuantity,
      reason: payload.reason,
    }),
  });

  return successResponse(null, 200);
}, CONTEXT);

export const PATCH = withAuthGuard(async (_auth, req: Request, routeContext: ParamsContext) =>
  handler(req, routeContext),
);
