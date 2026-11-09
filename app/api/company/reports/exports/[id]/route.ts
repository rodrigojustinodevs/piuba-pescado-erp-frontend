import type { ExportStatus } from '@/features/reportExport/types';
import { createDetailGetHandler } from '@/shared/lib/api/routeFactories';

export const GET = createDetailGetHandler<{ response: ExportStatus }, ExportStatus>({
  backendPathBuilder: ({ id }) => `/api/company/reports/exports/${encodeURIComponent(id)}`,
  context: 'Report Export Status API Proxy',
  mapResponse: (data) => data.response,
});
