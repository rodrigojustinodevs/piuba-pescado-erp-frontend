import type { ApiSensor, Sensor, UpdateSensorData } from '@/features/sensor/types';
import { mapApiSensor } from '@/features/sensor/utils/apiMapper';
import { createDeleteHandler, createDetailGetHandler, createPutHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Sensors API Proxy';

type ApiSensorDetailEnvelope = { response?: ApiSensor } | ApiSensor;

function mapDetailResponse(data: ApiSensorDetailEnvelope): Sensor {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiSensor(api as ApiSensor);
}

export const GET = createDetailGetHandler<ApiSensorDetailEnvelope, Sensor, { id: string }>({
  backendPathBuilder: (params) => `/api/company/sensor/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiSensorDetailEnvelope, UpdateSensorData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/sensor/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { ...rest } = payload;
    return rest;
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/sensor/${params.id}`,
  context: CONTEXT,
});
