import type {
  ApiSensorReading,
  ApiSensorReadingListResponse,
  CreateSensorReadingData,
  SensorReadingListResponse,
} from '@/features/sensorReading/types';
import { mapApiSensorReading, mapApiSensorReadingList } from '@/features/sensorReading/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Sensor readings API Proxy';

export const GET = createListGetHandler<ApiSensorReadingListResponse, SensorReadingListResponse>({
  backendPath: '/api/company/sensor-readings',
  mapResponse: mapApiSensorReadingList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});

type ApiSensorReadingCreateResponse = { response?: ApiSensorReading } | ApiSensorReading;

export const POST = createUpsertHandler<ApiSensorReadingCreateResponse, CreateSensorReadingData>({
  backendPath: '/api/company/sensor-reading',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiSensorReading(api as ApiSensorReading);
  },
});
