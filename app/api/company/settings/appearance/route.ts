import type { CompanySettings } from '@/features/companySettings/types';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const GET = createListGetHandler<{ response: CompanySettings }, CompanySettings>({
  backendPath: '/api/company/settings/appearance',
  context: 'Company Settings Appearance API Proxy',
  buildQueryString: () => '',
  mapResponse: (data) => data.response,
});

export const PUT = createUpsertHandler<{ response: CompanySettings }, unknown>({
  backendPath: '/api/company/settings/appearance',
  method: 'PUT',
  context: 'Company Settings Appearance API Proxy',
  mapResponse: (data) => data.response,
});
