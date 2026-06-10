/**
 * Qualidade da água — contrato com GET /api/company/water-qualities
 */

import type { ApiPagination } from '@/shared/types/api';
import { Sensor } from '../sensor/types';

export type Quality = 'excellent' | 'good' | 'warning' | 'critical' | 'unknown';
export interface ApiWaterQuality {
  id: string;
  measuredAt: string;
  ph: string;
  dissolvedOxygen: string;
  temperature: string;
  ammonia: string;
  salinity?: string;
  turbidity?: string;
  notes?: string | null;
  quality: Quality;
  tank: {
    id: string;
    name: string;
    sensor: Sensor | null;
  };
  company: {
    name: string | null;
  };
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiWaterQualityListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiWaterQuality[] | { data?: ApiWaterQuality[] };
};

export interface WaterQuality {
  id: string;
  measuredAt: string;
  ph: string;
  dissolvedOxygen: string;
  temperature: string;
  ammonia: string;
  salinity: string;
  turbidity: string;
  notes: string | null;
  quality: Quality;
  tank: {
    id: string;
    name: string;
    sensor: Sensor | null;
  };
  company: {
    name: string | null;
  };
  createdAt: string | null;
  updatedAt: string | null;
}

/** Payload enviado em POST /api/company/water-qualities */
export interface CreateWaterQualityData {
  tankId: string;
  measuredAt: string;
  ph: number;
  dissolvedOxygen: number;
  temperature: number;
  ammonia: number;
  salinity: number;
  turbidity: number;
  notes: string | null;
}

export interface UpdateWaterQualityData extends CreateWaterQualityData {
  id: string;
}

export interface WaterQualityListResponse {
  score: number;
  excellent: number;
  good: number;
  warning: number;
  critical: number;
  unknown: number;
  waterQualities: WaterQuality[];
  total: number;
  page: number;
  limit: number;
}

export type WaterQualityDialogMode = 'create' | 'edit' | 'view';

export type WaterQualitiesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: WaterQualityListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  waterQualities: WaterQuality[];
  stats: {
    total: number;
    uniqueTanksOnPage: number;
    avgPhDisplay: string;
    lastMeasurementLabel: string;
    score: number;
    excellent: number;
    good: number;
    warning: number;
    critical: number;
    unknown: number;
  };
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};
