/**
 * Tipos relacionados à entidade Sensor
 */

import type { ApiListResponse } from '@/shared/types/api';

export type SensorType = 'ph' | 'temperature' | 'oxygen' | 'dissolved_oxygen' | 'ammonia' | 'etc';
export type SensorStatus = 'online' | 'offline' | 'maintenance';
export type SensorTypeFilter = 'all' | SensorType;

export const sensorTypeLabels: Record<SensorType, string> = {
  temperature: 'Temperatura',
  ph: 'pH',
  oxygen: 'Oxigênio Dissolvido',
  dissolved_oxygen: 'Oxigênio Dissolvido',
  ammonia: 'Amônia',
  etc: 'Outros',
};

export interface Sensor {
  id: string;
  name: string;
  serialNumber: string;
  company: {
    name: string;
  };
  sensorType: SensorType;
  installationDate: string;
  status: string;
  battery: number | null;
  tankId: string;
  lastReading: number | null;
  unit: string;
  notes?: string | null;
  tank: {
    id: string;
    name: string;
  };
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiSensor {
  id: string;
  name: string;
  serialNumber: string;
  company: {
    name: string;
  };
  sensorType: SensorType;
  installationDate: string;
  status: 'online' | 'offline' | 'maintenance';
  battery: number | null;
  tankId: string;
  tank: {
    id: string;
    name: string;
  };
  lastReading: number | null;
  unit: string;
  notes?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiSensorListResponse = ApiListResponse<ApiSensor>;

export interface SensorListResponse {
  sensors: Sensor[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSensorData {
  companyId?: string;
  tankId: string;
  sensorType: SensorType;
  name?: string;
  serialNumber?: string;
  battery?: number | null;
  unit?: string;
  lastReading?: number | null;
  installationDate: string;
  status: SensorStatus;
  notes?: string | null;
}

export interface UpdateSensorData extends Partial<CreateSensorData> {
  id: string;
}

export type SensorDialogMode = 'create' | 'edit' | 'view';

export type SensorsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  filter: SensorStatus;
  setFilter: (next: SensorStatus) => void;
  sensorTypeFilter: SensorTypeFilter;
  setSensorTypeFilter: (next: SensorTypeFilter) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: SensorListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  filteredSensors: Sensor[];
  stats: {
    total: number;
    offline: number;
    maintenance: number;
  };
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};
