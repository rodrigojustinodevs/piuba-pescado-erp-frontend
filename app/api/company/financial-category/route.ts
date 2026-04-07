import type { ApiFinancialCategory, CreateFinancialCategoryData } from '@/features/financialCategory/types';
import { mapApiFinancialCategory } from '@/features/financialCategory/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Financial Category API Proxy';

type ApiFinancialCategoryCreateResponse = { response?: ApiFinancialCategory } | ApiFinancialCategory;

export const POST = createUpsertHandler<
  ApiFinancialCategoryCreateResponse,
  CreateFinancialCategoryData
>({
  backendPath: '/api/company/financial-category',
  method: 'POST',
  context: CONTEXT,
  mapBody: (payload) => {
    const body: Record<string, unknown> = {
      name: payload.name.trim(),
      type: payload.type,
      status: payload.status,
    };
    if (payload.companyId?.trim()) {
      body.companyId = payload.companyId.trim();
    }
    return body;
  },
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiFinancialCategory(api as ApiFinancialCategory);
  },
});
