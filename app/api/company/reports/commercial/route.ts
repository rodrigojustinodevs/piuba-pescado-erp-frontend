import type { StartExportResult } from '@/features/reportExport/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const POST = createUpsertHandler<{ response: StartExportResult }, unknown>({
  backendPath: '/api/company/reports/commercial',
  method: 'POST',
  context: 'Commercial Report Export API Proxy',
  mapResponse: (data) => data.response,
});
