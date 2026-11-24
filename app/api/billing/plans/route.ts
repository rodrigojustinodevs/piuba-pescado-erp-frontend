import type { ApiEnvelope, Plan } from '@/features/billing/types';
import { mapPlansEnvelope } from '@/features/billing/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

export const GET = createListGetHandler<ApiEnvelope<Plan[] | null>, Plan[]>({
  backendPath: '/api/billing/plans',
  context: 'Billing Plans API Proxy',
  buildQueryString: () => '',
  mapResponse: mapPlansEnvelope,
});
