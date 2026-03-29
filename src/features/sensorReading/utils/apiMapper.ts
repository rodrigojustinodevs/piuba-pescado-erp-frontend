import type {
  ApiSensorReading,
  ApiSensorReadingListResponse,
  SensorReading,
  SensorReadingListResponse,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

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

export function mapApiSensorReadingList(
  apiData: ApiSensorReadingListResponse,
): SensorReadingListResponse {
  const sensorReadings: SensorReading[] = extractListFromPagedApiResponse(apiData).map(
    mapApiSensorReading,
  );
  return {
    sensorReadings,
    ...getApiPagedListMeta(apiData),
  };
}
