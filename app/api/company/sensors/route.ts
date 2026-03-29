import type { ApiSensorListResponse, SensorListResponse } from '@/features/sensor/types';
import { mapApiSensorList } from '@/features/sensor/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Sensors API Proxy';

export const GET = createListGetHandler<ApiSensorListResponse, SensorListResponse>({
  backendPath: '/api/company/sensors',
  mapResponse: mapApiSensorList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});
