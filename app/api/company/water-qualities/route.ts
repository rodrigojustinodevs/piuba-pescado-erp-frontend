import type {
  ApiWaterQuality,
  ApiWaterQualityListResponse,
  CreateWaterQualityData,
  WaterQualityListResponse,
} from '@/features/waterQuality/types';
import {
  mapApiWaterQuality,
  mapApiWaterQualityList,
  mapCreateWaterQualityToApiPayload,
} from '@/features/waterQuality/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

const CONTEXT = 'Water qualities API Proxy';

export const GET = createListGetHandler<ApiWaterQualityListResponse, WaterQualityListResponse>({
  backendPath: '/api/company/water-qualities',
  mapResponse: mapApiWaterQualityList,
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, { limitParam: 'per_page' }),
});

type ApiWaterQualityCreateResponse = { response?: ApiWaterQuality } | ApiWaterQuality;

export const POST = createUpsertHandler<ApiWaterQualityCreateResponse, CreateWaterQualityData>({
  backendPath: '/api/company/water-quality',
  method: 'POST',
  context: CONTEXT,
  mapBody: mapCreateWaterQualityToApiPayload,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiWaterQuality(api as ApiWaterQuality);
  },
});
