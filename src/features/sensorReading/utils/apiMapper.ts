import type {
  ApiSensorReading,
  ApiSensorReadingListResponse,
  SensorReading,
  SensorReadingListResponse,
} from '../types';

export function mapApiSensorReading(api: ApiSensorReading): SensorReading {
  return {
    id: api.id,
    sensorId: api.sensorId,
    companyId: api.companyId,
    value: api.value,
    unit: api.unit,
    measuredAt: api.measuredAt,
    notes: api.notes ?? null,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt,
    sensorType: api.sensor?.sensorType ?? '',
    sensorStatus: api.sensor?.status ?? '',
    tankId: api.sensor?.tank?.id ?? '',
    tankName: api.sensor?.tank?.name ?? '',
  };
}

function extractList(apiData: ApiSensorReadingListResponse): ApiSensorReading[] {
  const r = apiData.response;
  if (Array.isArray(r)) return r;
  if (r && typeof r === 'object' && 'data' in r && Array.isArray(r.data)) return r.data;
  return [];
}

function normalizePage(value: number | undefined): number {
  if (value == null || value < 1) return 1;
  return value;
}

function normalizeLimit(value: number | undefined): number {
  if (value == null || value < 1) return 25;
  return value;
}

export function mapApiSensorReadingList(
  apiData: ApiSensorReadingListResponse,
): SensorReadingListResponse {
  const sensorReadings: SensorReading[] = extractList(apiData).map(mapApiSensorReading);
  return {
    sensorReadings,
    total: apiData.pagination?.total ?? 0,
    page: normalizePage(apiData.pagination?.current_page),
    limit: normalizeLimit(apiData.pagination?.per_page),
  };
}
