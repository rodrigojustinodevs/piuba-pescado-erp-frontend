import type {
  CreateSensorReadingData,
  SensorReading,
  SensorReadingListResponse,
  UpdateSensorReadingData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const sensorReadingService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SensorReadingListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/sensor-readings?${queryString}`
      : '/api/company/sensor-readings';
    return browserHttpClient.get<SensorReadingListResponse>(endpoint);
  },

  async create(data: CreateSensorReadingData): Promise<SensorReading> {
    return browserHttpClient.post<SensorReading>('/api/company/sensor-readings', data);
  },

  async getById(id: string): Promise<SensorReading> {
    return browserHttpClient.get<SensorReading>(`/api/company/sensor-readings/${id}`);
  },

  async update(data: UpdateSensorReadingData): Promise<SensorReading> {
    const { id, ...body } = data;
    return browserHttpClient.put<SensorReading>(`/api/company/sensor-readings/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<void>(`/api/company/sensor-readings/${id}`);
  },
};
