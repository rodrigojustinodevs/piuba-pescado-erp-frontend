import type { DataOverview } from '@/features/companySettings/types';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

export const GET = createListGetHandler<{ response: DataOverview }, DataOverview>({
  backendPath: '/api/company/settings/data',
  context: 'Company Settings Data API Proxy',
  buildQueryString: () => '',
  mapResponse: (data) => data.response,
});
