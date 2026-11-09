import type { StartExportResult } from '@/features/reportExport/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const POST = createUpsertHandler<{ response: StartExportResult }, unknown>({
  backendPath: '/api/company/reports/tank',
  method: 'POST',
  context: 'Tank Report Export API Proxy',
  mapResponse: (data) => data.response,
});
