import type { ApiSensorReading, SensorReading, UpdateSensorReadingData } from '@/features/sensorReading/types';
import { mapApiSensorReading } from '@/features/sensorReading/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Sensor readings API Proxy';

type ApiSensorReadingDetailEnvelope = { response?: ApiSensorReading } | ApiSensorReading;

function mapDetailResponse(data: ApiSensorReadingDetailEnvelope): SensorReading {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiSensorReading(api as ApiSensorReading);
}

export const GET = createDetailGetHandler<
  ApiSensorReadingDetailEnvelope,
  SensorReading,
  { id: string }
>({
  backendPathBuilder: (params) => `/api/company/sensor-reading/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<
  ApiSensorReadingDetailEnvelope,
  UpdateSensorReadingData,
  { id: string }
>({
  backendPathBuilder: (params) => `/api/company/sensor-reading/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { ...rest } = payload;
    return rest;
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/sensor-reading/${params.id}`,
  context: CONTEXT,
});
