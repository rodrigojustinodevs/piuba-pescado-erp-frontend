/**
 * Qualidade da água — contrato com GET /api/company/water-qualities
 */

import type { ApiPagination } from '@/shared/types/api';

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
  tank?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ApiWaterQualityListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiWaterQuality[] | { data?: ApiWaterQuality[] };
  pagination?: ApiPagination;
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
  tankId: string;
  tankName: string;
  createdAt: string;
  updatedAt: string;
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
  waterQualities: WaterQuality[];
  total: number;
  page: number;
  limit: number;
}
