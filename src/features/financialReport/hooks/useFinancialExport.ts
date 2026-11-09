'use client';

import { sortedCopy } from '@/features/reportExport/signature';
import { useReportExport } from '@/features/reportExport/useReportExport';
import { FINANCIAL_EXPORT_STORAGE_KEY } from '../constants';
import { financialReportService } from '../services/financialReportService';
import type { StartExportInput } from '../types';

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({ ...input, categoryIds: sortedCopy(input.categoryIds) });
}

export function useFinancialExport() {
  return useReportExport<StartExportInput>({
    storageKey: FINANCIAL_EXPORT_STORAGE_KEY,
    queryKeyPrefix: 'financial-report',
    startExport: financialReportService.startExport,
    getExport: financialReportService.getExport,
    signature: filtersSignature,
  });
}
