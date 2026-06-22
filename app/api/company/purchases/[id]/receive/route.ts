import type { ApiPurchase, Purchase } from '@/features/purchase/types';
import { mapApiPurchase } from '@/features/purchase/utils/apiMapper';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { successResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { serverHttpClient } from '@/shared/lib/http';

const CONTEXT = 'Purchase receive API Proxy';

type ParamsContext = {
  params: Promise<{ id: string }>;
};

type ApiPurchaseReceiveEnvelope = { response?: ApiPurchase } | ApiPurchase;

function mapDetailResponse(data: ApiPurchaseReceiveEnvelope): Purchase {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiPurchase(api as ApiPurchase);
}

const handler = withErrorHandling(async function PATCH(req: Request, routeContext: ParamsContext) {
  const params = await routeContext.params;
  const body = await req.json().catch(() => undefined);
  const data = await serverHttpClient.request<ApiPurchaseReceiveEnvelope>(
    `/api/company/purchase/${params.id}/receive`,
    {
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
    },
  );

  return successResponse(mapDetailResponse(data), 200);
}, CONTEXT);

export const PATCH = withAuthGuard(async (_auth, req: Request, routeContext: ParamsContext) =>
  handler(req, routeContext),
);
