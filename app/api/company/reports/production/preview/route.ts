import type { ProductionPreview } from '@/features/productionReport/types';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

const ALLOWED_PARAMS = new Set([
  'cutoffDate',
  'periodStart',
  'periodEnd',
  'status',
  'batchIds[]',
  'tankIds[]',
]);

export const GET = createListGetHandler<{ response: ProductionPreview }, ProductionPreview>({
  backendPath: '/api/company/reports/production/preview',
  context: 'Production Report Preview API Proxy',
  mapResponse: (data) => data.response,
  buildQueryString: (searchParams) => {
    const out = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (ALLOWED_PARAMS.has(key) && value !== '') out.append(key, value);
    }
    return out.toString();
  },
});
