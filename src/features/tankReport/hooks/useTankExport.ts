'use client';

import { useReportExport } from '@/features/reportExport/useReportExport';
import { TANK_EXPORT_STORAGE_KEY } from '../constants';
import { tankReportService } from '../services/tankReportService';
import type { StartExportInput } from '../types';

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({
    ...input,
    tankIds: [...input.tankIds].sort(),
    tankTypeIds: [...input.tankTypeIds].sort(),
  });
}

export function useTankExport() {
  return useReportExport<StartExportInput>({
    storageKey: TANK_EXPORT_STORAGE_KEY,
    queryKeyPrefix: 'tank-report',
    startExport: tankReportService.startExport,
    getExport: tankReportService.getExport,
    signature: filtersSignature,
  });
}
