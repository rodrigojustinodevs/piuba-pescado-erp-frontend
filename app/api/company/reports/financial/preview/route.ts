import type { FinancialPreview } from '@/features/financialReport/types';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

const ALLOWED_PARAMS = ['cutoffDate', 'periodStart', 'periodEnd', 'categoryIds[]'];

export const GET = createListGetHandler<{ response: FinancialPreview }, FinancialPreview>({
  backendPath: '/api/company/reports/financial/preview',
  context: 'Financial Report Preview API Proxy',
  mapResponse: (data) => data.response,
  buildQueryString: (searchParams) => {
    const out = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (ALLOWED_PARAMS.includes(key) && value !== '') out.append(key, value);
    }
    return out.toString();
  },
});
