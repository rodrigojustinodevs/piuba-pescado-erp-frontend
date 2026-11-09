import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import type {
  ExportStatus,
  FinancialFilters,
  FinancialPreview,
  StartExportInput,
  StartExportResult,
} from '../types';

const BASE = '/api/company/reports';

function buildFilterQuery(filters: FinancialFilters): string {
  const params = new URLSearchParams();
  if (filters.cutoffDate) params.set('cutoffDate', filters.cutoffDate);
  if (filters.periodStart) params.set('periodStart', filters.periodStart);
  if (filters.periodEnd) params.set('periodEnd', filters.periodEnd);
  for (const id of filters.categoryIds) params.append('categoryIds[]', id);
  return params.toString();
}

function buildExportBody(input: StartExportInput) {
  return {
    ...(input.cutoffDate && { cutoffDate: input.cutoffDate }),
    ...(input.periodStart && { periodStart: input.periodStart }),
    ...(input.periodEnd && { periodEnd: input.periodEnd }),
    ...(input.categoryIds.length > 0 && { categoryIds: input.categoryIds }),
    includeDetails: input.includeDetails,
  };
}

export const financialReportService = {
  preview(filters: FinancialFilters): Promise<FinancialPreview> {
    const qs = buildFilterQuery(filters);
    return browserHttpClient.get<FinancialPreview>(
      qs ? `${BASE}/financial/preview?${qs}` : `${BASE}/financial/preview`,
    );
  },

  startExport(input: StartExportInput): Promise<StartExportResult> {
    return browserHttpClient.post<StartExportResult>(`${BASE}/financial`, buildExportBody(input));
  },

  /** Cada chamada devolve uma `downloadUrl` assinada nova: nunca cachear. */
  getExport(id: string): Promise<ExportStatus> {
    return browserHttpClient.get<ExportStatus>(`${BASE}/exports/${encodeURIComponent(id)}`);
  },
};
