import type { SecuritySettings } from '@/features/companySettings/types';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const GET = createListGetHandler<{ response: SecuritySettings }, SecuritySettings>({
  backendPath: '/api/company/settings/security',
  context: 'Company Settings Security API Proxy',
  buildQueryString: () => '',
  mapResponse: (data) => data.response,
});

export const PUT = createUpsertHandler<{ response: SecuritySettings }, unknown>({
  backendPath: '/api/company/settings/security',
  method: 'PUT',
  context: 'Company Settings Security API Proxy',
  mapResponse: (data) => data.response,
});
