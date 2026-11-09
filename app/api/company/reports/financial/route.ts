import type { StartExportResult } from '@/features/reportExport/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const POST = createUpsertHandler<{ response: StartExportResult }, unknown>({
  backendPath: '/api/company/reports/financial',
  method: 'POST',
  context: 'Financial Report Export API Proxy',
  mapResponse: (data) => data.response,
});
