import type {
  ApiWaterQuality,
  ApiWaterQualityListResponse,
  CreateWaterQualityData,
  WaterQuality,
  WaterQualityListResponse,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

export function mapApiWaterQuality(api: ApiWaterQuality): WaterQuality {
  return {
    id: api.id,
    measuredAt: api.measuredAt,
    ph: api.ph,
    dissolvedOxygen: api.dissolvedOxygen,
    temperature: api.temperature,
    ammonia: api.ammonia,
    salinity: api.salinity ?? '',
    turbidity: api.turbidity ?? '',
    notes: api.notes ?? null,
    tankId: api.tank?.id ?? '',
    tankName: api.tank?.name ?? '',
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

/** Corpo JSON esperado pelo backend (snake_case onde aplicável). */
export function mapCreateWaterQualityToApiPayload(data: CreateWaterQualityData) {
  return {
    tankId: data.tankId,
    measured_at: data.measuredAt,
    ph: data.ph,
    dissolved_oxygen: data.dissolvedOxygen,
    temperature: data.temperature,
    ammonia: data.ammonia,
    salinity: data.salinity,
    turbidity: data.turbidity,
    notes: data.notes,
  };
}

export function mapApiWaterQualityList(
  apiData: ApiWaterQualityListResponse,
): WaterQualityListResponse {
  const waterQualities: WaterQuality[] = extractListFromPagedApiResponse(apiData).map(
    mapApiWaterQuality,
  );
  return {
    waterQualities,
    ...getApiPagedListMeta(apiData),
  };
}
