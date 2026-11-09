import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import type {
  CommercialFilters,
  CommercialPreview,
  ExportStatus,
  StartExportInput,
  StartExportResult,
} from '../types';

const BASE = '/api/company/reports';

function buildFilterQuery(filters: CommercialFilters): string {
  const params = new URLSearchParams();
  if (filters.cutoffDate) params.set('cutoffDate', filters.cutoffDate);
  if (filters.periodStart) params.set('periodStart', filters.periodStart);
  if (filters.periodEnd) params.set('periodEnd', filters.periodEnd);
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.paymentMethod) params.set('paymentMethod', filters.paymentMethod);
  for (const id of filters.clientIds) params.append('clientIds[]', id);
  for (const id of filters.batchIds) params.append('batchIds[]', id);
  return params.toString();
}

function buildExportBody(input: StartExportInput) {
  return {
    ...(input.cutoffDate && { cutoffDate: input.cutoffDate }),
    ...(input.periodStart && { periodStart: input.periodStart }),
    ...(input.periodEnd && { periodEnd: input.periodEnd }),
    status: input.status,
    ...(input.paymentMethod && { paymentMethod: input.paymentMethod }),
    ...(input.clientIds.length > 0 && { clientIds: input.clientIds }),
    ...(input.batchIds.length > 0 && { batchIds: input.batchIds }),
    includeDetails: input.includeDetails,
  };
}

export const commercialReportService = {
  preview(filters: CommercialFilters): Promise<CommercialPreview> {
    const qs = buildFilterQuery(filters);
    return browserHttpClient.get<CommercialPreview>(
      qs ? `${BASE}/commercial/preview?${qs}` : `${BASE}/commercial/preview`,
    );
  },

  startExport(input: StartExportInput): Promise<StartExportResult> {
    return browserHttpClient.post<StartExportResult>(`${BASE}/commercial`, buildExportBody(input));
  },

  /** Cada chamada devolve uma `downloadUrl` assinada nova: nunca cachear. */
  getExport(id: string): Promise<ExportStatus> {
    return browserHttpClient.get<ExportStatus>(`${BASE}/exports/${encodeURIComponent(id)}`);
  },
};
