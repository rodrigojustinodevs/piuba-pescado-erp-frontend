'use client';

import { useReportExport } from '@/features/reportExport/useReportExport';
import { INVENTORY_EXPORT_STORAGE_KEY } from '../constants';
import { inventoryReportService } from '../services/inventoryReportService';
import type { StartExportInput } from '../types';

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({
    ...input,
    categories: [...input.categories].sort(),
    stockTypes: [...input.stockTypes].sort(),
    supplyIds: [...input.supplyIds].sort(),
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
