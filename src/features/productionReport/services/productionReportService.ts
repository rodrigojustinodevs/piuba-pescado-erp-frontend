import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import type {
  ExportStatus,
  ProductionPreview,
  ReportFilters,
  StartExportInput,
  StartExportResult,
} from '../types';

const BASE = '/api/company/reports';

function buildFilterQuery(filters: ReportFilters): string {
  const params = new URLSearchParams();
  if (filters.cutoffDate) params.set('cutoffDate', filters.cutoffDate);
  if (filters.periodStart) params.set('periodStart', filters.periodStart);
  if (filters.periodEnd) params.set('periodEnd', filters.periodEnd);
  if (filters.status !== 'all') params.set('status', filters.status);
  for (const id of filters.batchIds) params.append('batchIds[]', id);
  for (const id of filters.tankIds) params.append('tankIds[]', id);
  return params.toString();
}

function buildExportBody(input: StartExportInput) {
  return {
    ...(input.cutoffDate && { cutoffDate: input.cutoffDate }),
    ...(input.periodStart && { periodStart: input.periodStart }),
    ...(input.periodEnd && { periodEnd: input.periodEnd }),
    status: input.status,
    ...(input.batchIds.length > 0 && { batchIds: input.batchIds }),
    ...(input.tankIds.length > 0 && { tankIds: input.tankIds }),
    includeDetails: input.includeDetails,
  };
}

export const productionReportService = {
  preview(filters: ReportFilters): Promise<ProductionPreview> {
    const qs = buildFilterQuery(filters);
    return browserHttpClient.get<ProductionPreview>(
      qs ? `${BASE}/production/preview?${qs}` : `${BASE}/production/preview`,
    );
  },

  startExport(input: StartExportInput): Promise<StartExportResult> {
    return browserHttpClient.post<StartExportResult>(`${BASE}/production`, buildExportBody(input));
  },

  /** Cada chamada devolve uma `downloadUrl` assinada nova: nunca cachear. */
  getExport(id: string): Promise<ExportStatus> {
    return browserHttpClient.get<ExportStatus>(`${BASE}/exports/${encodeURIComponent(id)}`);
  },
};
