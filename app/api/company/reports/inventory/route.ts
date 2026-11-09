import type { StartExportResult } from '@/features/reportExport/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const POST = createUpsertHandler<{ response: StartExportResult }, unknown>({
  backendPath: '/api/company/reports/inventory',
  method: 'POST',
  context: 'Inventory Report Export API Proxy',
  mapResponse: (data) => data.response,
});
