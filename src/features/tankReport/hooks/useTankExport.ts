'use client';

import { sortedCopy } from '@/features/reportExport/signature';
import { useReportExport } from '@/features/reportExport/useReportExport';
import { TANK_EXPORT_STORAGE_KEY } from '../constants';
import { tankReportService } from '../services/tankReportService';
import type { TankFilters } from '../types';

export function filtersSignature(input: TankFilters): string {
  return JSON.stringify({
    ...input,
    tankIds: sortedCopy(input.tankIds),
    tankTypeIds: sortedCopy(input.tankTypeIds),
  });
}

export function useTankExport() {
  return useReportExport<TankFilters>({
    storageKey: TANK_EXPORT_STORAGE_KEY,
    queryKeyPrefix: 'tank-report',
    startExport: tankReportService.startExport,
    getExport: tankReportService.getExport,
    signature: filtersSignature,
  });
}
