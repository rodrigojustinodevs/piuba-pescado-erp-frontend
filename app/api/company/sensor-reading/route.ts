import type { ApiSensorReading, CreateSensorReadingData } from '@/features/sensorReading/types';
import { mapApiSensorReading } from '@/features/sensorReading/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Sensor reading API Proxy';

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
