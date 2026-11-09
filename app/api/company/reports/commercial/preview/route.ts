import type { CommercialPreview } from '@/features/commercialReport/types';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

const ALLOWED_PARAMS = [
  'cutoffDate',
  'periodStart',
  'periodEnd',
  'status',
  'paymentMethod',
  'clientIds[]',
  'batchIds[]',
];

export const GET = createListGetHandler<{ response: CommercialPreview }, CommercialPreview>({
  backendPath: '/api/company/reports/commercial/preview',
  context: 'Commercial Report Preview API Proxy',
  mapResponse: (data) => data.response,
  buildQueryString: (searchParams) => {
    const out = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (ALLOWED_PARAMS.includes(key) && value !== '') out.append(key, value);
    }
    return out.toString();
  },
});
