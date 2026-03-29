import type { ApiSensorReadingListResponse, SensorReadingListResponse } from '@/features/sensorReading/types';
import { mapApiSensorReadingList } from '@/features/sensorReading/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Sensor readings API Proxy';

export const GET = createListGetHandler<ApiSensorReadingListResponse, SensorReadingListResponse>({
  backendPath: '/api/company/sensor-readings',
  mapResponse: mapApiSensorReadingList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});
