'use client';

import { useReportExport } from '@/features/reportExport/useReportExport';
import { COMMERCIAL_EXPORT_STORAGE_KEY } from '../constants';
import { commercialReportService } from '../services/commercialReportService';
import type { StartExportInput } from '../types';

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({
    ...input,
    clientIds: [...input.clientIds].sort(),
    batchIds: [...input.batchIds].sort(),
  });
}

export function useCommercialExport() {
  return useReportExport<StartExportInput>({
    storageKey: COMMERCIAL_EXPORT_STORAGE_KEY,
    queryKeyPrefix: 'commercial-report',
    startExport: commercialReportService.startExport,
    getExport: commercialReportService.getExport,
    signature: filtersSignature,
  });
}
