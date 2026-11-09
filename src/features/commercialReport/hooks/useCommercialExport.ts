'use client';

import { sortedCopy } from '@/features/reportExport/signature';
import { useReportExport } from '@/features/reportExport/useReportExport';
import { COMMERCIAL_EXPORT_STORAGE_KEY } from '../constants';
import { commercialReportService } from '../services/commercialReportService';
import type { StartExportInput } from '../types';

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({
    ...input,
    clientIds: sortedCopy(input.clientIds),
    batchIds: sortedCopy(input.batchIds),
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
