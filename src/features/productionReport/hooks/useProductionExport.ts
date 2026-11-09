'use client';

import { useReportExport } from '@/features/reportExport/useReportExport';
import { EXPORT_STORAGE_KEY } from '../constants';
import { productionReportService } from '../services/productionReportService';
import type { StartExportInput } from '../types';

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({
    ...input,
    batchIds: [...input.batchIds].sort(),
    tankIds: [...input.tankIds].sort(),
  });
}

export function useProductionExport() {
  return useReportExport<StartExportInput>({
    storageKey: EXPORT_STORAGE_KEY,
    queryKeyPrefix: 'production-report',
    startExport: productionReportService.startExport,
    getExport: productionReportService.getExport,
    signature: filtersSignature,
  });
}
