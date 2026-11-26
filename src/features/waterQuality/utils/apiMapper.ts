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

/**
 * A API às vezes envia os parâmetros como número (ex.: `salinity: 0`), apesar do contrato
 * declarar string. Normaliza para string para que o restante do app possa confiar no tipo.
 */
function toMetricString(value: unknown): string {
  return value == null ? '' : String(value);
}

export function mapApiWaterQuality(api: ApiWaterQuality): WaterQuality {
  return {
    id: api.id,
    measuredAt: api.measuredAt,
    ph: toMetricString(api.ph),
    dissolvedOxygen: toMetricString(api.dissolvedOxygen),
    temperature: toMetricString(api.temperature),
    ammonia: toMetricString(api.ammonia),
    salinity: toMetricString(api.salinity),
    turbidity: toMetricString(api.turbidity),
    quality: api.quality,
    notes: api.notes ?? null,
    company: api.company ?? { name: null },
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
    tank: api.tank ?? { id: '', name: '', sensor: null },
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
  const waterQualities: WaterQuality[] =
    extractListFromPagedApiResponse(apiData).map(mapApiWaterQuality);
  return {
    waterQualities,
    ...getApiPagedListMeta(apiData),
  };
}
