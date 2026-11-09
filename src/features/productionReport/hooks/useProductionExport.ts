'use client';

import { sortedCopy } from '@/features/reportExport/signature';
import { useReportExport } from '@/features/reportExport/useReportExport';
import { EXPORT_STORAGE_KEY } from '../constants';
import { productionReportService } from '../services/productionReportService';
import type { StartExportInput } from '../types';

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({
    ...input,
    batchIds: sortedCopy(input.batchIds),
    tankIds: sortedCopy(input.tankIds),
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
