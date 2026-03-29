/**
 * Tipos relacionados à entidade Sensor
 */

import type { ApiListResponse } from '@/shared/types/api';

export interface Sensor {
  id: string;
  sensorType: string;
  installationDate: string;
  status: string;
  tankId: string;
  tankName: string;
  createdAt: string | null;
  updatedAt: string;
}

export interface ApiSensor {
  id: string;
  sensorType: string;
  installationDate: string;
  status: string;
  tankId?: string;
  tank?: {
    id: string;
    name: string;
  };
  createdAt: string | null;
  updatedAt: string;
}

export type ApiSensorListResponse = ApiListResponse<ApiSensor>;

export interface SensorListResponse {
  sensors: Sensor[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSensorData {
  sensorType: string;
  installationDate: string;
  status: string;
  tankId: string;
}

export interface UpdateSensorData extends CreateSensorData {
  id: string;
}
