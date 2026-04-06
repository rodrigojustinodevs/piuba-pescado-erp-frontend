import type {
  ApiWaterQuality,
  UpdateWaterQualityData,
  WaterQuality,
} from '@/features/waterQuality/types';
import {
  mapApiWaterQuality,
  mapCreateWaterQualityToApiPayload,
} from '@/features/waterQuality/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Water qualities API Proxy';

type ApiWaterQualityDetailEnvelope = { response?: ApiWaterQuality } | ApiWaterQuality;

function mapDetailResponse(data: ApiWaterQualityDetailEnvelope): WaterQuality {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiWaterQuality(api as ApiWaterQuality);
}

export const GET = createDetailGetHandler<
  ApiWaterQualityDetailEnvelope,
  WaterQuality,
  { id: string }
>({
  backendPathBuilder: (params) => `/api/company/water-quality/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<
  ApiWaterQualityDetailEnvelope,
  UpdateWaterQualityData,
  { id: string }
>({
  backendPathBuilder: (params) => `/api/company/water-quality/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { ...rest } = payload;
    return mapCreateWaterQualityToApiPayload(rest);
  },
  mapResponse: mapDetailResponse,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/water-quality/${params.id}`,
  context: CONTEXT,
});
