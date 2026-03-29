import type { ApiSensor, CreateSensorData } from '@/features/sensor/types';
import { mapApiSensor } from '@/features/sensor/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Sensor API Proxy';

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
