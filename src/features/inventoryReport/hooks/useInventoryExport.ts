'use client';

import { sortedCopy } from '@/features/reportExport/signature';
import { useReportExport } from '@/features/reportExport/useReportExport';
import { INVENTORY_EXPORT_STORAGE_KEY } from '../constants';
import { inventoryReportService } from '../services/inventoryReportService';
import type { StartExportInput } from '../types';

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({
    ...input,
    categories: sortedCopy(input.categories),
    stockTypes: sortedCopy(input.stockTypes),
    supplyIds: sortedCopy(input.supplyIds),
  });
}

export function useInventoryExport() {
  return useReportExport<StartExportInput>({
    storageKey: INVENTORY_EXPORT_STORAGE_KEY,
    queryKeyPrefix: 'inventory-report',
    startExport: inventoryReportService.startExport,
    getExport: inventoryReportService.getExport,
    signature: filtersSignature,
  });
}
