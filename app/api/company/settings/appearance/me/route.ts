import type { CompanySettings } from '@/features/companySettings/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const PUT = createUpsertHandler<{ response: CompanySettings }, unknown>({
  backendPath: '/api/company/settings/appearance/me',
  method: 'PUT',
  context: 'Company Settings User Appearance API Proxy',
  mapResponse: (data) => data.response,
});
