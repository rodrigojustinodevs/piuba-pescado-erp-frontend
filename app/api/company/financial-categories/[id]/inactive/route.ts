import type { ApiFinancialCategory, FinancialCategory } from '@/features/financialCategory/types';
import { mapApiFinancialCategory } from '@/features/financialCategory/utils/apiMapper';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { successResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { serverHttpClient } from '@/shared/lib/http';

const CONTEXT = 'Financial Category inactive API Proxy';

type ParamsContext = {
  params: Promise<{ id: string }>;
};

type ApiFinancialCategoryEnvelope = { response?: ApiFinancialCategory } | ApiFinancialCategory;

function mapDetailResponse(data: ApiFinancialCategoryEnvelope): FinancialCategory {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiFinancialCategory(api as ApiFinancialCategory);
}

const handler = withErrorHandling(async function PATCH(_req: Request, routeContext: ParamsContext) {
  const params = await routeContext.params;
  const data = await serverHttpClient.request<ApiFinancialCategoryEnvelope>(
    `/api/company/financial-category/${params.id}/inactive`,
    {
      method: 'PATCH',
    },
  );

  return successResponse(mapDetailResponse(data), 200);
}, CONTEXT);

export const PATCH = withAuthGuard(async (_auth, req: Request, routeContext: ParamsContext) =>
  handler(req, routeContext),
);

