import type {
  ApiPurchase,
  ApiPurchasePayment,
  Purchase,
  PurchasePayment,
  PurchasePaymentsResponse,
  PurchasePaymentSummary,
} from '@/features/purchase/types';
import { mapApiPurchase, mapApiPurchasePayment } from '@/features/purchase/utils/apiMapper';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { successResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { serverHttpClient } from '@/shared/lib/http';

const CONTEXT = 'Purchase payments API Proxy';

type ParamsContext = {
  params: Promise<{ id: string }>;
};

// GET response shape from backend
type ApiPaymentsGetResponse = {
  status?: boolean;
  message?: string;
  response?: {
    purchase?: {
      id: string;
      code: string;
      totalAmount: number;
      totalPaid: number;
      balance: number;
      progress: number;
      paymentStatus: string;
    };
    payments?: ApiPurchasePayment[];
  };
};

// POST response shape (returns updated purchase)
type ApiPurchasePaymentEnvelope = { response?: ApiPurchase } | ApiPurchase;

function mapPaymentsGetResponse(data: ApiPaymentsGetResponse): PurchasePaymentsResponse {
  const inner = data.response;
  const p = inner?.purchase;

  const summary: PurchasePaymentSummary = {
    id: p?.id ?? '',
    code: p?.code ?? '',
    totalAmount: p?.totalAmount ?? 0,
    totalPaid: p?.totalPaid ?? 0,
    balance: p?.balance ?? 0,
    progress: p?.progress ?? 0,
    paymentStatus: p?.paymentStatus ?? 'pending',
  };

  const payments: PurchasePayment[] = (inner?.payments ?? []).map(mapApiPurchasePayment);

  return { summary, payments };
}

function mapPurchaseResponse(data: ApiPurchasePaymentEnvelope): Purchase {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiPurchase(api as ApiPurchase);
}

const getHandler = withErrorHandling(async function GET(_req: Request, routeContext: ParamsContext) {
  const params = await routeContext.params;
  const data = await serverHttpClient.request<ApiPaymentsGetResponse>(
    `/api/company/purchase/${params.id}/payments`,
    { method: 'GET' },
  );
  return successResponse(mapPaymentsGetResponse(data), 200);
}, CONTEXT);

const postHandler = withErrorHandling(async function POST(req: Request, routeContext: ParamsContext) {
  const params = await routeContext.params;
  const body = await req.json().catch(() => undefined);
  const data = await serverHttpClient.request<ApiPurchasePaymentEnvelope>(
    `/api/company/purchase/${params.id}/payments`,
    {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    },
  );
  return successResponse(mapPurchaseResponse(data), 200);
}, CONTEXT);

export const GET = withAuthGuard(async (_auth, req: Request, routeContext: ParamsContext) =>
  getHandler(req, routeContext),
);

export const POST = withAuthGuard(async (_auth, req: Request, routeContext: ParamsContext) =>
  postHandler(req, routeContext),
);
