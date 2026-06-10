import type { ApiSensor, ApiSensorListResponse, Sensor, SensorListResponse } from '../types';

export function mapApiSensor(api: ApiSensor): Sensor {
  return {
    id: api.id,
    name: api.name,
    serialNumber: api.serialNumber,
    company: api.company,
    sensorType: api.sensorType,
    installationDate: api.installationDate,
    status: api.status,
    battery: api.battery,
    tankId: api.tankId,
    lastReading: api.lastReading,
    unit: api.unit,
    notes: api.notes ?? null,
    tank: api.tank,
    createdAt: api.createdAt,
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
