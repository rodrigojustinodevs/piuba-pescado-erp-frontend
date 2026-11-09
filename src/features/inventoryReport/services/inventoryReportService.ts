import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import type {
  ExportStatus,
  InventoryFilters,
  InventoryPreview,
  StartExportInput,
  StartExportResult,
} from '../types';

const BASE = '/api/company/reports';

function buildFilterQuery(filters: InventoryFilters): string {
  const params = new URLSearchParams();
  if (filters.cutoffDate) params.set('cutoffDate', filters.cutoffDate);
  if (filters.periodStart) params.set('periodStart', filters.periodStart);
  if (filters.periodEnd) params.set('periodEnd', filters.periodEnd);
  if (filters.situation !== 'all') params.set('situation', filters.situation);
  if (filters.includeInactive) params.set('includeInactive', '1');
  for (const v of filters.categories) params.append('categories[]', v);
  for (const v of filters.stockTypes) params.append('stockTypes[]', v);
  for (const v of filters.supplyIds) params.append('supplyIds[]', v);
  return params.toString();
}

function buildExportBody(input: StartExportInput) {
  return {
    ...(input.cutoffDate && { cutoffDate: input.cutoffDate }),
    ...(input.periodStart && { periodStart: input.periodStart }),
    ...(input.periodEnd && { periodEnd: input.periodEnd }),
    situation: input.situation,
    includeInactive: input.includeInactive,
    ...(input.categories.length > 0 && { categories: input.categories }),
    ...(input.stockTypes.length > 0 && { stockTypes: input.stockTypes }),
    ...(input.supplyIds.length > 0 && { supplyIds: input.supplyIds }),
    includeDetails: input.includeDetails,
  };
}

export const inventoryReportService = {
  preview(filters: InventoryFilters): Promise<InventoryPreview> {
    const qs = buildFilterQuery(filters);
    return browserHttpClient.get<InventoryPreview>(
      qs ? `${BASE}/inventory/preview?${qs}` : `${BASE}/inventory/preview`,
    );
  },

  startExport(input: StartExportInput): Promise<StartExportResult> {
    return browserHttpClient.post<StartExportResult>(`${BASE}/inventory`, buildExportBody(input));
  },

  /** Cada chamada devolve uma `downloadUrl` assinada nova: nunca cachear. */
  getExport(id: string): Promise<ExportStatus> {
    return browserHttpClient.get<ExportStatus>(`${BASE}/exports/${encodeURIComponent(id)}`);
  },
};
