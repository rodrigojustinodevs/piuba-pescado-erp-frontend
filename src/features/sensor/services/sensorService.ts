import type { CreateSensorData, Sensor, SensorListResponse, UpdateSensorData } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const sensorService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SensorListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString ? `/api/company/sensors?${queryString}` : '/api/company/sensors';
    return browserHttpClient.get<SensorListResponse>(endpoint);
  },

  async create(data: CreateSensorData): Promise<Sensor> {
    return browserHttpClient.post<Sensor>('/api/company/sensors', data);
  },

  async getById(id: string): Promise<Sensor> {
    return browserHttpClient.get<Sensor>(`/api/company/sensors/${id}`);
  },

  async update(data: UpdateSensorData): Promise<Sensor> {
    const { id, ...body } = data;
    return browserHttpClient.put<Sensor>(`/api/company/sensors/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<void>(`/api/company/sensors/${id}`);
  },
};
