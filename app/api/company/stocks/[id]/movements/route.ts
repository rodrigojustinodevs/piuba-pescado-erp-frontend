import type { CreateMovementData } from '@/features/stock/types';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { successResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { serverHttpClient } from '@/shared/lib/http';

const CONTEXT = 'Stock Movements API Proxy';

type ParamsContext = {
  params: Promise<{ id: string }>;
};

const handler = withErrorHandling(async function POST(req: Request, routeContext: ParamsContext) {
  const params = await routeContext.params;
  const payload = (await req.json()) as Omit<CreateMovementData, 'stockId'>;

  await serverHttpClient.request<unknown>(`/api/company/stock/${params.id}/movements`, {
    method: 'POST',
    body: JSON.stringify({
      type: payload.type,
      dest_stock_id: payload.destStockId || undefined,
      supply_id: payload.supplyId,
      quantity: payload.quantity,
      reason: payload.reason,
      notes: payload.notes || undefined,
    }),
  });

  return successResponse(null, 201);
}, CONTEXT);

export const POST = withAuthGuard(async (_auth, req: Request, routeContext: ParamsContext) =>
  handler(req, routeContext),
);
