import type { Plan } from '@/features/billing/types';
import { mapPlansEnvelope } from '@/features/billing/utils/apiMapper';

type RawPlansEnvelope = Parameters<typeof mapPlansEnvelope>[0];
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

export const GET = createListGetHandler<RawPlansEnvelope, Plan[]>({
  backendPath: '/api/billing/plans',
  context: 'Billing Plans API Proxy',
  buildQueryString: () => '',
  mapResponse: mapPlansEnvelope,
});
