/**
 * Tipos relacionados à entidade Species (espécie)
 */

import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

export interface GrowthCurvePoint {
  day: number;
  weightG: number;
}

export interface Species {
  id: string;
  name: string;
  idealTemperatureMin?: number;
  idealTemperatureMax?: number;
  idealDissolvedOxygenMin?: number;
  criticalDissolvedOxygenMin?: number;
  idealSalinityMin?: number;
  idealSalinityMax?: number;
  expectedFcr?: number;
  maxFeedingRatePctBiomass?: number;
  growthCurveReference?: GrowthCurvePoint[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpeciesData {
  name: string;
  idealTemperatureMin?: number;
  idealTemperatureMax?: number;
  idealDissolvedOxygenMin?: number;
  criticalDissolvedOxygenMin?: number;
  idealSalinityMin?: number;
  idealSalinityMax?: number;
  expectedFcr?: number;
  maxFeedingRatePctBiomass?: number;
  growthCurveReference?: GrowthCurvePoint[];
}

export interface UpdateSpeciesData extends Partial<CreateSpeciesData> {
  id: string;
}

/**
 * Formato de espécie retornado pela API (camelCase, igual ao formato do frontend)
 */
export type ApiSpecies = Species;

export type ApiSpeciesListResponse = ApiListResponse<ApiSpecies>;
export type ApiSpeciesResponse = ApiResponse<ApiSpecies>;

export interface SpeciesListResponse {
  species: Species[];
  total: number;
  page: number;
  limit: number;
}
