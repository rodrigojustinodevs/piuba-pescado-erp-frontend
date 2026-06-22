/**
 * Tipos relacionados à entidade SensorReading (Leitura de sensor)
 */

import type { ApiPagination } from '@/shared/types/api';

export type SensorReadingType = 'manual' | 'automatic';
export interface SensorReadingSensor {
  id: string;
  name?: string | null;
  sensorType?: string;
  status?: string;
  tank?: {
    id: string;
    name: string;
  } | null;
}

export interface SensorReading {
  id: string;
  type: SensorReadingType;
  companyId: string;
  value: number;
  unit: string;
  measuredAt: string;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string;
  sensor?: SensorReadingSensor;
}

export interface ApiSensorReading {
  id: string;
  type: SensorReadingType;
  companyId: string;
  value: number;
  unit: string;
  measuredAt: string;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string;
  sensor?: SensorReadingSensor;
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
