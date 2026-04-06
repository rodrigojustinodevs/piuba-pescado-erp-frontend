import type { ApiSale, Sale } from '@/features/sale/types';
import { mapApiSale } from '@/features/sale/utils/apiMapper';
import { createDetailDeleteJsonHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Sale cancel API Proxy';

type ApiSaleCancelEnvelope = { response?: ApiSale } | ApiSale;

function mapCancelResponse(data: ApiSaleCancelEnvelope): Sale {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiSale(api as ApiSale);
}

export const DELETE = createDetailDeleteJsonHandler<ApiSaleCancelEnvelope, { id: string }>({
  backendPathBuilder: (params) => `/api/company/sale/${params.id}/cancel`,
  context: CONTEXT,
  mapResponse: mapCancelResponse,
});
