import type { StartDataExportResult } from '@/features/companySettings/types';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

export const POST = createUpsertHandler<{ response: StartDataExportResult }, unknown>({
  backendPath: '/api/company/settings/exports',
  method: 'POST',
  context: 'Company Settings Data Export API Proxy',
  mapResponse: (data) => data.response,
});
