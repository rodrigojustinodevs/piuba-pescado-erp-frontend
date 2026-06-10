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
  const sensorType = api.sensor?.sensorType;

  return {
    id: api.id,
    type: api.type ?? 'automatic',
    companyId: api.companyId,
    value: api.value,
    unit: api.unit,
    measuredAt: api.measuredAt,
    notes: api.notes ?? null,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt,
    sensor: api.sensor
      ? {
          ...api.sensor,
          name: api.sensor.name ?? (sensorType ? `Sensor ${sensorType}` : 'Sensor'),
        }
      : undefined,
  };
}

export function mapApiSensorReadingList(
  apiData: ApiSensorReadingListResponse,
): SensorReadingListResponse {
  const sensorReadings: SensorReading[] =
    extractListFromPagedApiResponse(apiData).map(mapApiSensorReading);
  return {
    sensorReadings,
    ...getApiPagedListMeta(apiData),
  };
}
