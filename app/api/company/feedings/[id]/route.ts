import type { Feeding, UpdateFeedingData } from '@/features/feeding/types';
import { mapApiFeedingDetail, type ApiFeedingDetail } from '@/features/feeding/utils/apiMapper';
import { createDetailGetHandler, createPutHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Feedings API Proxy';

type ApiFeedingDetailEnvelope = { response?: ApiFeedingDetail } | ApiFeedingDetail;

function mapDetailResponse(data: ApiFeedingDetailEnvelope): Feeding {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiFeedingDetail(api as ApiFeedingDetail);
}

export const GET = createDetailGetHandler<ApiFeedingDetailEnvelope, Feeding, { id: string }>({
  backendPathBuilder: (params) => `/api/company/feeding/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetailResponse,
});

export const PUT = createPutHandler<ApiFeedingDetailEnvelope, UpdateFeedingData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/feeding/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const { ...rest } = payload;
    return rest;
  },
  mapResponse: mapDetailResponse,
});
