import type { CompanySettings } from '@/shared/types/companySettings';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

export const GET = createListGetHandler<{ response: CompanySettings }, CompanySettings>({
  backendPath: '/api/company/settings',
  context: 'Company Settings API Proxy',
  buildQueryString: () => '',
  mapResponse: (data) => data.response,
});
