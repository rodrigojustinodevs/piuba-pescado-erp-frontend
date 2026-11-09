import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import type {
  ExportStatus,
  StartExportInput,
  StartExportResult,
  TankFilters,
  TankPreview,
} from '../types';

const BASE = '/api/company/reports';

function buildFilterQuery(filters: TankFilters): string {
  const params = new URLSearchParams();
  if (filters.cutoffDate) params.set('cutoffDate', filters.cutoffDate);
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.occupancy !== 'all') params.set('occupancy', filters.occupancy);
  for (const id of filters.tankIds) params.append('tankIds[]', id);
  for (const id of filters.tankTypeIds) params.append('tankTypeIds[]', id);
  return params.toString();
}

function buildExportBody(input: StartExportInput) {
  return {
    ...(input.cutoffDate && { cutoffDate: input.cutoffDate }),
    status: input.status,
    occupancy: input.occupancy,
    ...(input.tankIds.length > 0 && { tankIds: input.tankIds }),
    ...(input.tankTypeIds.length > 0 && { tankTypeIds: input.tankTypeIds }),
  };
}

export const tankReportService = {
  preview(filters: TankFilters): Promise<TankPreview> {
    const qs = buildFilterQuery(filters);
    return browserHttpClient.get<TankPreview>(
      qs ? `${BASE}/tank/preview?${qs}` : `${BASE}/tank/preview`,
    );
  },

  startExport(input: StartExportInput): Promise<StartExportResult> {
    return browserHttpClient.post<StartExportResult>(`${BASE}/tank`, buildExportBody(input));
  },

  /** Cada chamada devolve uma `downloadUrl` assinada nova: nunca cachear. */
  getExport(id: string): Promise<ExportStatus> {
    return browserHttpClient.get<ExportStatus>(`${BASE}/exports/${encodeURIComponent(id)}`);
  },
};
