import type { CompanySettings } from '@/features/companySettings/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const PUT = createUpsertHandler<{ response: CompanySettings }, unknown>({
  backendPath: '/api/company/settings/units',
  method: 'PUT',
  context: 'Company Settings Units API Proxy',
  mapResponse: (data) => data.response,
});
