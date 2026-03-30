import type {
  ApiSensor,
  ApiSensorListResponse,
  CreateSensorData,
  SensorListResponse,
} from '@/features/sensor/types';
import { mapApiSensor, mapApiSensorList } from '@/features/sensor/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Sensors API Proxy';

export const GET = createListGetHandler<ApiSensorListResponse, SensorListResponse>({
  backendPath: '/api/company/sensors',
  mapResponse: mapApiSensorList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});

type ApiSensorCreateResponse = { response?: ApiSensor } | ApiSensor;

export const POST = createUpsertHandler<ApiSensorCreateResponse, CreateSensorData>({
  backendPath: '/api/company/sensor',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiSensor(api as ApiSensor);
  },
});
