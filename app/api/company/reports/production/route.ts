import type { StartExportResult } from '@/features/productionReport/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const POST = createUpsertHandler<{ response: StartExportResult }, unknown>({
  backendPath: '/api/company/reports/production',
  method: 'POST',
  context: 'Production Report Export API Proxy',
  mapResponse: (data) => data.response,
});
