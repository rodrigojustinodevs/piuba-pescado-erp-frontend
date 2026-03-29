import type { ApiSensor, ApiSensorListResponse, Sensor, SensorListResponse } from '../types';

export function mapApiSensor(api: ApiSensor): Sensor {
  return {
    id: api.id,
    sensorType: api.sensorType,
    installationDate: api.installationDate,
    status: api.status,
    tankId: api.tankId ?? api.tank?.id ?? '',
    tankName: api.tank?.name ?? '',
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt,
  };
}

export function mapApiSensorList(apiData: ApiSensorListResponse): SensorListResponse {
  const sensors: Sensor[] = (apiData.response ?? []).map(mapApiSensor);
  return {
    sensors,
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}
