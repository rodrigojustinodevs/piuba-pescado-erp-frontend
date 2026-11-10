import type { NotificationPreference } from '@/features/companySettings/types';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const GET = createListGetHandler<
  { response: NotificationPreference[] },
  NotificationPreference[]
>({
  backendPath: '/api/company/settings/notifications',
  context: 'Company Settings Notifications API Proxy',
  buildQueryString: () => '',
  mapResponse: (data) => data.response,
});

export const PUT = createUpsertHandler<{ response: NotificationPreference[] }, unknown>({
  backendPath: '/api/company/settings/notifications',
  method: 'PUT',
  context: 'Company Settings Notifications API Proxy',
  mapResponse: (data) => data.response,
});
