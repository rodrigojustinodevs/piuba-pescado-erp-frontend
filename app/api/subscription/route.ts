import { mapAccessSnapshot, type ApiAccessSnapshot } from '@/shared/access/entitlements';
import type { AccessSnapshot } from '@/shared/access/types';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

/**
 * GET /api/subscription — estado de plano da empresa ativa para qualquer membro:
 * plano, status, somente leitura, dias de teste e entitlements com used/limit.
 */
export const GET = createListGetHandler<{ response?: ApiAccessSnapshot | null }, AccessSnapshot>({
  backendPath: '/api/subscription',
  context: 'Subscription Entitlements API Proxy',
  buildQueryString: () => '',
  mapResponse: (data) => mapAccessSnapshot(data.response),
});
