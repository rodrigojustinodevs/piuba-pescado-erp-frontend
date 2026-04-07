import type {
  ApiFinancialCategory,
  FinancialCategory,
  UpdateFinancialCategoryData,
} from '@/features/financialCategory/types';
import { mapApiFinancialCategory } from '@/features/financialCategory/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Financial Category detail API Proxy';

type ApiFinancialCategoryDetailEnvelope =
  | { response?: ApiFinancialCategory }
  | ApiFinancialCategory;

function mapDetailResponse(data: ApiFinancialCategoryDetailEnvelope): FinancialCategory {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiFinancialCategory(api as ApiFinancialCategory);
}

export const GET = createDetailGetHandler<
  ApiFinancialCategoryDetailEnvelope,
  FinancialCategory,
  { id: string }
>({
  backendPathBuilder: (params) => `/api/company/financial-category/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<
  ApiFinancialCategoryDetailEnvelope,
  UpdateFinancialCategoryData,
  { id: string }
>({
  backendPathBuilder: (params) => `/api/company/financial-category/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { ...rest } = payload;
    const body: Record<string, unknown> = {
      name: rest.name.trim(),
      type: rest.type,
      status: rest.status,
    };
    if (rest.companyId?.trim()) {
      body.companyId = rest.companyId.trim();
    }
    return body;
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/financial-category/${params.id}`,
  context: CONTEXT,
});
