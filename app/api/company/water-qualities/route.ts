import type { ApiWaterQualityListResponse, WaterQualityListResponse } from '@/features/waterQuality/types';
import { mapApiWaterQualityList } from '@/features/waterQuality/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Water qualities API Proxy';

export const GET = createListGetHandler<ApiWaterQualityListResponse, WaterQualityListResponse>({
  backendPath: '/api/company/water-qualities',
  mapResponse: mapApiWaterQualityList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});
