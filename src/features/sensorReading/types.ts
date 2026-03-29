/**
 * Tipos relacionados à entidade SensorReading (Leitura de sensor)
 */

import type { ApiPagination } from '@/shared/types/api';

export interface SensorReading {
  id: string;
  sensorId: string;
  companyId: string;
  value: number;
  unit: string;
  measuredAt: string;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string;
  sensorType: string;
  sensorStatus: string;
  tankId: string;
  tankName: string;
}

export interface ApiSensorReading {
  id: string;
  sensorId: string;
  companyId: string;
  value: number;
  unit: string;
  measuredAt: string;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string;
  sensor?: {
    id: string;
    sensorType: string;
    status: string;
    tank?: {
      id: string;
      name: string;
    };
  };
}

export type ApiSensorReadingListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiSensorReading[] | { data?: ApiSensorReading[] };
  pagination?: ApiPagination;
};

export interface SensorReadingListResponse {
  sensorReadings: SensorReading[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSensorReadingData {
  sensorId: string;
  value: number;
  unit: string;
  measuredAt: string;
  notes: string | null;
}

export interface UpdateSensorReadingData extends CreateSensorReadingData {
  id: string;
}
