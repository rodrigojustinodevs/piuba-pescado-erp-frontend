import type { CompanySettings } from '@/features/companySettings/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const PUT = createUpsertHandler<{ response: CompanySettings }, unknown>({
  backendPath: '/api/company/settings/general',
  method: 'PUT',
  context: 'Company Settings General API Proxy',
  mapResponse: (data) => data.response,
});
